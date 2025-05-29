// Hero.tsx
type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
};

export default function Heading({level, className="", children}: HeadingProps ) {
    const Tag = `h${level}` as keyof HTMLElementTagNameMap;
    return (
        <Tag className={className}>{children}</Tag>
    );
}