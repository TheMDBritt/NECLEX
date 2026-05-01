import type { Metadata } from "next";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";
import { LabReference } from "@/components/reference/lab-reference";
import { labValues } from "@/lib/content/lab-values";

export const metadata: Metadata = {
  title: "Lab values",
};

export default function LabsPage() {
  return (
    <PageFrame>
      <Container size="md">
        <section className="pb-16 pt-12 sm:pt-16">
          <Eyebrow>Reference · Lab values</Eyebrow>
          <h1 className="mt-4 max-w-[20ch] font-display text-[clamp(2rem,4.4vw,3.25rem)] font-light leading-[1.08] tracking-[-0.025em] text-ink">
            Adult lab values.
          </h1>
          <p className="mt-5 max-w-[58ch] font-body text-[1rem] leading-[1.6] text-ink-soft">
            Search by name or filter by system. Each entry shows the range, what it tells you, and
            common drivers of abnormal values.
          </p>

          <div className="mt-10">
            <LabReference labs={labValues} />
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
