import Image from "next/image";
import DragDropArea from "../components/ui/dragNdrop/dragDropArea";

import { Particles } from "../components/ui/particles";
export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen relative">
        <div className="absolute inset-0 z-0 ">
          <Particles />
        </div>

        <main className="h-full flex flex-col items-center justify-center pointer-events-auto z-1">
          <DragDropArea />
          <p className=" mt-24 text-base text-center max-w-[200px] tracking-tighter leading-tight">
           🤖 Voidground uses AI to remove background with high precision. 
          </p>
          <p className=" mt-5 text-base text-center max-w-[200px] tracking-tighter leading-tight">
            Your image is processed securely on server. 
          </p>
        </main>
      </div>
    </>
  );
}
