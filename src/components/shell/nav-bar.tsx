import Link from "next/link";
import { Container } from "@/components/primitives/container";
import { Wordmark } from "@/components/marks/wordmark";

const links = [
  { href: "/study", label: "Study" },
  { href: "/reference", label: "Reference" },
] as const;

export function NavBar() {
  return (
    <header className="relative z-10 pt-8 sm:pt-10">
      <Container>
        <div className="flex items-center justify-between">
          <Wordmark />
          <nav
            aria-label="Primary"
            className="flex items-center gap-7 font-body text-[14px] tracking-[0.02em] text-ink-soft sm:gap-9"
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="link-draw">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
