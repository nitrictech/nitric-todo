import Image from "next/image";
import { FC } from "react";
import type { ShirtProduct } from "types";
import { defaultImg } from "../lib/constants";

interface ShirtProps {
  shirt: Omit<ShirtProduct, "id" | "createdAt">;
  disableAnimation?: boolean;
}

export const Shirt: FC<ShirtProps> = ({ shirt, disableAnimation }) => {
  return (
    <div
      className={`flex shadow-lg py-8 m-8 px-4 rounded-md relative ${
        !disableAnimation ? "hover:animate-bounce" : ""
      }`}
      style={{
        backgroundColor: shirt.color,
        width: 80,
        height: 100,
        transform: !disableAnimation ? "translateY(-25%)" : undefined,
      }}
    >
      <div
        className='absolute rounded-lg top-5 z-10 left-0 transform -translate-x-1/2'
        style={{
          width: 30,
          height: 30,
          marginTop: -17.5,
          backgroundColor: shirt.color,
        }}
      />
      <div
        className='absolute rounded-lg top-5 z-10 right-0 transform translate-x-1/2'
        style={{
          width: 30,
          height: 30,
          marginTop: -17.5,
          backgroundColor: shirt.color,
        }}
      />
      <div
        className='white absolute top-0 z-10 rounded-full left-1/2 transform -translate-x-1/2'
        style={{
          width: 30,
          height: 30,
          marginTop: -15,
          backgroundColor: "white",
        }}
      />
      {shirt.img && (
        <div className='relative opacity-90 overflow-hidden w-12 h-full top-0 left-1/2 transform -translate-x-1/2 z-0'>
          <Image
            src={shirt.img}
            alt={"Shirt"}
            layout='fill'
            unoptimized
            objectFit='contain'
          />
        </div>
      )}
    </div>
  );
};
