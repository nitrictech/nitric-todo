import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import type { ShirtResponse } from "types";
import { AddShirt } from "../components/AddShirt";
import { Shirt } from "../components/Shirt";
import { defaultImg } from "../lib/constants";
import fetcher from "../lib/fetcher";

export default function Web() {
  const [pagingToken, setPagingToken] = useState(null);
  const { data, mutate } = useSWR<ShirtResponse>(`/apis/main/shirts`, fetcher);

  const loading = !data;

  return (
    <div>
      <Head>
        <title>Nitric Next.js Quickstart</title>
        <meta name='description' content='Nitric Quickstart for Next.js' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='p-10 mx-auto max-w-4xl'>
        <h1 className='text-6xl font-bold mb-4 text-center'>Next.js Starter</h1>
        <p className='mb-20 text-xl text-center'>
          🥶 Create the coolest swag in the world 🧊
        </p>
        <div className='items-center flex-col verti gap-6 flex w-full justify-center mb-12'>
          <AddShirt updateShirts={mutate} />
        </div>
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center gap-4'>
          {!loading
            ? data.shirts.map((shirt) => (
                <Shirt
                  key={shirt.id}
                  shirt={{
                    ...shirt,
                    img:
                      shirt.img !== defaultImg
                        ? `/apis/main/shirts/objects/${shirt.img}`
                        : defaultImg,
                  }}
                />
              ))
            : null}
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
