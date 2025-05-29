import Image from "next/image";
import Header from "./layout/header/Header";
import DragDropArea from "./components/dragNdrop/dragDropArea";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <DragDropArea />
      </main>
    </>
  );
}
