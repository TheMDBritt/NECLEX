import type { Metadata } from "next";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

export const metadata: Metadata = {
  title: "Mnemonics",
};

export default function MnemonicsPage() {
  return (
    <PageFrame>
      <Container size="md">
        <section className="pb-16 pt-12 sm:pt-16">
          <Eyebrow>Reference · Mnemonics</Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.25rem)] font-light leading-[1.08] tracking-[-0.025em] text-ink">
            Mnemonics.
          </h1>
          <p className="mt-5 max-w-[58ch] font-body text-[1rem] leading-[1.6] text-ink-soft">
            Coming next round, with audio. Acronyms, songs, and image anchors all in one place.
          </p>
        </section>
      </Container>
    </PageFrame>
  );
}
