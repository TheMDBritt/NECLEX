import { Container } from "@/components/primitives/container";
import { verseForDate } from "@/lib/content/verses";

export function SiteFooter() {
  const verse = verseForDate();
  return (
    <footer className="relative z-10 mt-24 border-t border-ink/10 pb-10 pt-12">
      <Container>
        <div className="mx-auto max-w-[60ch] text-center">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            For today
          </p>
          <p className="mt-4 font-display text-[1.0625rem] italic leading-[1.6] text-lavender-600 sm:text-[1.125rem]">
            &ldquo;{verse.text}&rdquo;
          </p>
          <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            {verse.ref}
          </p>
        </div>

        <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint/70">
          Educational use · Not medical advice · Not affiliated with NCSBN
          <sup className="text-[7px]">®</sup> or Pearson VUE
        </p>
      </Container>
    </footer>
  );
}
