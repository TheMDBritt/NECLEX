import { Container } from "@/components/primitives/container";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-ink/10 pb-8 pt-8">
      <Container>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          Not affiliated with NCSBN<sup className="text-[7px]">®</sup> or Pearson VUE · Educational use only · Not medical advice · Made with care
        </p>
      </Container>
    </footer>
  );
}
