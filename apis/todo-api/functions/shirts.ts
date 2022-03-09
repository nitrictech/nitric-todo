import { api, bucket, collection, FileMode } from "@nitric/sdk";
import uuid from "short-uuid";
import type { ShirtProduct, ShirtsPostRequest } from "types";

const shirtsCollection = collection("shirts").for<Omit<ShirtProduct, "id">>(
  "reading",
  "writing"
);

const shirtsBucket = bucket("shirts").for("writing", "reading");

const shirtsApi = api("main");

shirtsApi.get("/shirts", async (ctx) => {
  const { documents } = await shirtsCollection.query().fetch();

  const shirts = documents
    .map((d) => ({
      id: d.id,
      img: "/nitric.svg",
      ...d.content,
    }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  ctx.res.json({ shirts });

  return ctx;
});

shirtsApi.post("/shirts", async (ctx) => {
  const { color, img } = ctx.req.json() as ShirtsPostRequest;

  if (!color || !img) {
    ctx.res.body = "A shirt requires a color and an img.";
    ctx.res.status = 400;
    return ctx;
  }

  try {
    const id = uuid.generate();
    const now = new Date().getTime();

    console.log(`Adding shirt: ${id}`);

    await shirtsCollection.doc(id).set({
      color,
      createdAt: now,
      img,
    });

    ctx.res.body = "Successfully added shirt!";
  } catch (e) {
    console.log(e);
    ctx.res.body = "Could not add shirt";
    ctx.res.status = 400;
  }

  return ctx;
});

shirtsApi.get("/shirts/objects/:filename", async (ctx) => {
  const { filename } = ctx.req.params;

  const signedUrl = await shirtsBucket
    .file(`images/${filename}`)
    .signUrl(FileMode.Read, { expiry: 60 });

  // redirect to image
  ctx.res.status = 302;
  ctx.res.headers = {
    Location: [signedUrl],
  };

  return ctx;
});

shirtsApi.post("/shirts/objects/:filename", async (ctx) => {
  const { filename } = ctx.req.params;
  const fileData = ctx.req.data as Uint8Array;

  try {
    await shirtsBucket.file(`images/${filename}`).write(fileData);

    ctx.res.body = `Successfully uploaded ${filename}`;
    ctx.res.status = 200;
  } catch (e) {
    ctx.res.body = `Error uploading image`;
    ctx.res.status = 400;
  }

  return ctx;
});
