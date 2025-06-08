import Image from "next/image";
import DragDropArea from "../components/ui/dragNdrop/dragDropArea";
import { Particles } from "@/components/ui/particles";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen relative">
        <div className="absolute inset-0 z-0">
          <Particles 
          moveParticlesOnHover={true}
          particleColors={["#babdc2", "#484b55"]}
          />
        </div>
        
        <main className="h-full flex flex-col items-center justify-center pointer-events-auto z-1">
          <DragDropArea />
        </main>
      </div>
    </>
  );
}
