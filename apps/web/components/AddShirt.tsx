import { ChangeEvent, useRef, useState } from "react";
import { defaultImg } from "../lib/constants";
import fetcher from "../lib/fetcher";
import { PopoverPicker } from "./PopoverPicker";
import { Shirt } from "./Shirt";

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function AddShirt({ updateShirts }) {
  const [color, setColor] = useState("#131720");
  const [img, setImg] = useState(defaultImg);
  const imageRef = useRef<File>();

  const handleAddShirt = async () => {
    const fileName = imageRef.current
      ? encodeURIComponent(imageRef.current.name)
      : defaultImg;

    // add file to bucket if not default img
    if (imageRef.current) {
      await fetch(`/apis/main/shirts/objects/${fileName}`, {
        method: "POST",
        body: imageRef.current,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": "attachment",
        },
      });
    }

    await fetch("/apis/main/shirts", {
      method: "POST",
      body: JSON.stringify({
        color,
        img: fileName,
      }),
    });

    updateShirts();
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (file) {
      // for preview
      const base64 = await toBase64(file);
      setImg(base64);

      imageRef.current = file;
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <Shirt
        disableAnimation
        shirt={{
          color,
          img,
        }}
      />
      <div className='flex flex-row gap-4 items-center justify-center'>
        <PopoverPicker color={color} onChange={setColor} />
        <div>
          <label className='bg-white transition-colors border-orange-500 border-2 hover:border-orange-700 text-orange-600 font-bold py-3 px-6 rounded cursor-pointer relative'>
            Add Image
            <input
              onChange={handleImageUpload}
              type='file'
              className='opacity-0 absolute left-0 w-full pointer-events-none'
            />
          </label>
        </div>
        <button
          onClick={handleAddShirt}
          className='bg-orange-500 transition-colors hover:bg-orange-700 text-white font-bold py-3 px-6 rounded cursor-pointer'
        >
          Upload Swag
        </button>
      </div>
    </div>
  );
}
