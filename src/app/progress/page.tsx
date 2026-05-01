import type { Metadata } from "next";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

export const metadata: Metadata = {
  title: "Progress",
};

const cjmmSteps = [
  { name: "Recognize Cues", note: "Begins after first 50 items" },
  { name: "Analyze Cues", note: "Begins after first 50 items" },
  { name: "Prioritize Hypotheses", note: "Begins after first 50 items" },
  { name: "Generate Solutions", note: "Begins after first 50 items" },
  { name: "Take Actions", note: "Begins after first 50 items" },
  { name: "Evaluate Outcomes", note: "Begins after first 50 items" },
];

const clientNeeds = [
  "Management of Care",
  "Safety & Infection Control",
  "Health Promotion & Maintenance",
  "Psychosocial Integrity",
  "Basic Care & Comfort",
  "Pharmacological & Parenteral Therapies",
  "Reduction of Risk Potential",
  "Physiological Adaptation",
];

export default function ProgressPage() {
  return (
    <PageFrame>
      <Container>
        <section className="pb-12 pt-20 sm:pt-28">
          <Eyebrow>Progress</Eyebrow>
          <h1 className="mt-5 max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.06] tracking-[-0.03em] text-ink">
            A quiet map of where you are.
          </h1>
          <p className="mt-7 max-w-[52ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft">
            No leaderboards, no shaming streaks. Just an honest picture of what's solid and what
            needs another pass.
          </p>
        </section>

        <section aria-labelledby="cjmm" className="pb-12">
          <h2
            id="cjmm"
            className="font-display text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.18] tracking-[-0.02em] text-ink"
          >
            Mastery by clinical-judgment step
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cjmmSteps.map((s) => (
              <li
                key={s.name}
                className="rounded-xl border border-ink/10 bg-paper-deep/40 px-5 py-5"
              >
                <p className="font-display text-[1.0625rem] leading-[1.3] tracking-[-0.01em] text-ink">
                  {s.name}
                </p>
                <div
                  aria-hidden
                  className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/8"
                >
                  <div className="h-full w-0 bg-lavender-400 transition-all duration-500" />
                </div>
                <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                  {s.note}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="client-needs" className="pb-12">
          <h2
            id="client-needs"
            className="font-display text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.18] tracking-[-0.02em] text-ink"
          >
            Coverage across client needs
          </h2>
          <ul className="mt-6 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-paper">
            {clientNeeds.map((c) => (
              <li
                key={c}
                className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
              >
                <p className="font-body text-[15px] leading-[1.45] text-ink">{c}</p>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                  Builds with practice
                </p>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </PageFrame>
  );
}
