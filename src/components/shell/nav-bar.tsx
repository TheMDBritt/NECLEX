import Link from "next/link";
import { Container } from "@/components/primitives/container";
import { Button } from "@/components/primitives/button";
import { Wordmark } from "@/components/marks/wordmark";

const links = [
  { href: "/about", label: "Our approach" },
  { href: "/method", label: "The method" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function NavBar() {
  return (
    <header className="relative z-10 pt-8 sm:pt-10">
      <Container>
        <div className="flex items-center justify-between">
          <Wordmark />
          <nav
            aria-label="Primary"
            className="hidden items-center gap-9 font-body text-[14px] tracking-[0.02em] text-ink-soft sm:flex"
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="link-draw">
                {link.label}
              </Link>
            ))}
          </nav>
          <Button href="/sign-in" variant="outline" size="sm">
            Sign in
          </Button>
        </div>
      </Container>
    </header>
  );
}
