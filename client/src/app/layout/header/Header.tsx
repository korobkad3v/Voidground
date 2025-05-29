// Header.tsx
import Heading from "@/app/components/Heading/Heading";

export default function Header() {
    return (
        <header className="flex items-center justify-center mt-[100px] min-h-[60px]">
            <Heading level={1} className="text-4xl font-semibold w-full text-center">Voidground(0)</Heading>
        </header>
    );
}