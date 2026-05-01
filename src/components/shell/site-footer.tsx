import Link from "next/link";
import { Container } from "@/components/primitives/container";
import { Wordmark } from "@/components/marks/wordmark";

const groups = [
  {
    label: "Study",
    items: [
      { href: "/method", label: "The method" },
      { href: "/about", label: "Our approach" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    label: "Reference",
    items: [
      { href: "/drugs", label: "Drug library" },
      { href: "/labs", label: "Lab values" },
      { href: "/mnemonics", label: "Mnemonics" },
    ],
  },
  {
    label: "Quiet hours",
    items: [
      { href: "/contact", label: "Contact" },
      { href: "/changelog", label: "Changelog" },
      { href: "/journal", label: "Field notes" },
    ],
  },
  {
    label: "Fine print",
    items: [
      { href: "/legal/terms", label: "Terms" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/disclaimer", label: "Disclaimer" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-32 border-t border-ink/10 pb-10 pt-16 sm:pt-20">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Wordmark />
            <p className="mt-5 max-w-[42ch] font-body text-[15px] leading-[1.6] text-ink-soft">
              A study companion for nursing students preparing for the NCLEX-RN and NCLEX-PN.
              Anchored in the 2026 NCSBN test plan. Built with a steady, encouraging hand.
            </p>
          </div>
          {groups.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                {group.label}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-draw font-body text-[14.5px] tracking-[0.005em] text-ink-soft hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-ink/10 pt-8 sm:flex-row sm:items-end">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Not affiliated with NCSBN<sup className="text-[7px]">®</sup> or Pearson VUE · Educational use only · Not medical advice
          </p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            MMXXVI · Made with care
          </p>
        </div>
      </Container>
    </footer>
  );
}
