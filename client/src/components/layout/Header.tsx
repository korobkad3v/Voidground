// Header.tsx
import Heading from "@/components/ui/Heading/Heading";

export default function Header() {
    return (
        <header className="fixed w-full flex items-center justify-center top-[50px] min-h-[60px] z-10">
            <Heading level={1} className="text-4xl font-semibold w-full text-center">Voidground(0)</Heading>
        </header>
    );
}