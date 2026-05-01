import type { Metadata } from "next";
import { Button } from "@/components/primitives/button";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

export const metadata: Metadata = {
  title: "The method",
  description:
    "How NECLEX teaches clinical judgment — the six cognitive steps the NCLEX measures, and how the practice engine traces every question back to them.",
};

interface Step {
  number: string;
  name: string;
  pull: string;
  body: string;
  example: string;
  tone: "lavender" | "sage" | "clay" | "indigo";
}

const steps: Step[] = [
  {
    number: "I",
    name: "Recognize Cues",
    pull: "What is the patient telling me — directly or quietly?",
    body: "You scan the chart, the labs, the rhythm strip, the tone of voice. The skill is noticing what matters before anyone names it as a problem.",
    example:
      "Mrs. K's potassium dropped from 4.2 to 3.1 overnight. She's also on furosemide. Two cues, one story.",
    tone: "lavender",
  },
  {
    number: "II",
    name: "Analyze Cues",
    pull: "Which signals belong together, and which are noise?",
    body: "Cues alone are just numbers. The analysis is the link — patho to presentation, presentation to risk. This is where pharmacology and pathophysiology become one conversation.",
    example:
      "Hypokalemia + loop diuretic + new ST depression on the monitor → connect the dots, don't list them.",
    tone: "sage",
  },
  {
    number: "III",
    name: "Prioritize Hypotheses",
    pull: "If only one thing kills first, which one is it?",
    body: "Rank by urgency, likelihood, and consequence. The NCLEX rewards the nurse who can hold five worries at once and still know which one to act on first.",
    example:
      "Cardiac irritability beats electrolyte correction beats falls risk beats patient education — in this exact order, today.",
    tone: "clay",
  },
  {
    number: "IV",
    name: "Generate Solutions",
    pull: "What could I reasonably do — and what should not be on the table?",
    body: "Brainstorm before you commit. The strongest answer is usually the one that addresses the priority hypothesis with the least harm and the fastest reversibility.",
    example:
      "Hold the next furosemide dose · notify the provider · prepare oral or IV potassium · place on telemetry.",
    tone: "indigo",
  },
  {
    number: "V",
    name: "Take Actions",
    pull: "Move — but only the actions inside your scope, in the right order.",
    body: "Implementation under pressure. Right action, right patient, right time, right dose, right route, right documentation. The exam tests this with bow-tie items for a reason.",
    example: "Telemetry on first. K+ replacement second. Provider call third. Education last.",
    tone: "lavender",
  },
  {
    number: "VI",
    name: "Evaluate Outcomes",
    pull: "Did the picture change — and if not, why?",
    body: "Reassess. Compare what you expected to what's actually in front of you. If the patient isn't responding the way the textbook says, the loop starts over at step one.",
    example:
      "K+ now 3.8, ST changes resolved, telemetry stable → outcome met. Document, hand off, breathe.",
    tone: "sage",
  },
];

const toneText: Record<Step["tone"], string> = {
  lavender: "text-lavender-600",
  sage: "text-sage-600",
  clay: "text-clay-600",
  indigo: "text-indigo-deep",
};

const toneBg: Record<Step["tone"], string> = {
  lavender: "bg-lavender-50",
  sage: "bg-sage-50",
  clay: "bg-clay-50",
  indigo: "bg-paper-deep",
};

export default function MethodPage() {
  return (
    <PageFrame>
      <Container>
        <section className="pb-24 pt-20 sm:pt-28 lg:pt-32">
          <div className="grid grid-cols-12 gap-y-12">
            <div className="col-span-12 lg:col-span-3">
              <Eyebrow>The method</Eyebrow>
            </div>
            <div className="col-span-12 lg:col-span-9 lg:col-start-4">
              <h1 className="max-w-[18ch] font-display text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.04] tracking-[-0.03em] text-ink">
                The exam is measuring{" "}
                <em className="font-display italic text-lavender-600">how you think</em>, not just
                what you know.
              </h1>
              <p className="mt-8 max-w-[58ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft">
                The NCLEX uses the NCSBN Clinical Judgment Measurement Model — six cognitive steps a
                nurse moves through, sometimes in seconds. Every case study, every bow-tie item,
                every matrix question is built on these. We teach to all six, on purpose, and we
                show you which step you&rsquo;re strongest in week by week.
              </p>
            </div>
          </div>
        </section>

        <section aria-label="The six cognitive steps" className="pb-24">
          <ol className="space-y-px overflow-hidden rounded-2xl border border-ink/10">
            {steps.map((step) => (
              <li
                key={step.number}
                className={`grid grid-cols-12 items-start gap-x-6 gap-y-5 px-6 py-12 sm:px-10 sm:py-14 ${toneBg[step.tone]}`}
              >
                <div className="col-span-12 sm:col-span-3 lg:col-span-2">
                  <p
                    className={`font-display text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-none tracking-[-0.02em] ${toneText[step.tone]}`}
                  >
                    {step.number}
                  </p>
                  <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                    Step {step.number}
                  </p>
                </div>

                <div className="col-span-12 sm:col-span-9 lg:col-span-7">
                  <h2 className="font-display text-[1.875rem] font-light leading-[1.18] tracking-[-0.02em] text-ink sm:text-[2.25rem]">
                    {step.name}
                  </h2>
                  <p
                    className={`mt-3 font-display text-[1.125rem] italic leading-[1.45] ${toneText[step.tone]}`}
                  >
                    &ldquo;{step.pull}&rdquo;
                  </p>
                  <p className="mt-5 max-w-[58ch] font-body text-[15.5px] leading-[1.65] text-ink-soft">
                    {step.body}
                  </p>
                </div>

                <div className="col-span-12 lg:col-span-3">
                  <div className="rounded-lg border border-ink/10 bg-paper/70 p-5">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                      In practice
                    </p>
                    <p className="mt-3 font-body text-[14px] leading-[1.6] text-ink">
                      {step.example}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="pb-12">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8 rounded-2xl border border-ink/10 bg-paper-deep/40 px-6 py-12 sm:px-10 sm:py-16">
            <div className="col-span-12 lg:col-span-7">
              <Eyebrow withRule={false}>What you get back</Eyebrow>
              <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-light leading-[1.12] tracking-[-0.02em] text-ink">
                A weekly mastery map across all six steps — not just one accuracy number.
              </h2>
              <p className="mt-5 max-w-[58ch] font-body text-[15.5px] leading-[1.65] text-ink-soft">
                Most prep tools tell you &ldquo;72% on Pharm.&rdquo; That hides the part you need to
                know: <em className="not-italic text-ink">where</em> the thinking breaks down. We
                tag every item to its CJMM step so the dashboard can show you, gently, that
                you&rsquo;re strong at recognizing cues and shaky on prioritizing — and then route
                tomorrow&rsquo;s practice accordingly.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/start" arrow>
                  Try a guided session
                </Button>
                <Button href="/pricing" variant="ghost" size="sm">
                  <span className="link-draw">See pricing</span>
                </Button>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <ul className="grid grid-cols-2 gap-3">
                {steps.map((s) => (
                  <li
                    key={s.name}
                    className="rounded-lg border border-ink/10 bg-paper/70 px-4 py-4"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                      {s.number}
                    </p>
                    <p className="mt-1.5 font-display text-[15px] leading-[1.25] tracking-[-0.01em] text-ink">
                      {s.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
