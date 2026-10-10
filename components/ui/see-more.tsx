import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { btn } from "@/lib/ui";

/** CTA "Ver más" al pie de cada sección del home. */
export function SeeMore({
  href,
  children,
  tone = "light",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex justify-center pt-2">
      <Link
        href={href}
        className={btn(tone === "dark" ? "outline-light" : "outline", "lg", "w-full sm:w-auto")}
      >
        {children}
        <ArrowIcon width={18} height={18} />
      </Link>
    </div>
  );
}
