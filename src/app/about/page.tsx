import type { Metadata } from "next";
import { Botanical } from "@/components/marks/botanical";
import { Button } from "@/components/primitives/button";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

export const metadata: Metadata = {
  title: "Our approach",
  description:
    "Why NECLEX exists, who it's for, and the principles we won't compromise on — calm, accurate, transparent.",
};

const principles = [
  {
    kicker: "Principle I",
    title: "Calm is a feature, not a vibe.",
    body: "Every interaction is engineered to lower the stress floor — soft type, warm color, no alarm-red, no punishing streaks. The studies on test anxiety are clear: panicked recall is shallower recall. So we removed every interface decision that earns its drama at your expense.",
  },
  {
    kicker: "Principle II",
    title: "Every fact has a source, or it doesn't ship.",
    body: "Drug information is verified against current FDA labeling. Lab values follow standardized adult and pediatric ranges. Clinical guidelines come from the AHA, CDC, ACOG, ADA, and other primary bodies — not from a chatbot's best guess. If we can't cite it, we don't write it.",
  },
  {
    kicker: "Principle III",
    title: "We teach to the test plan, not around it.",
    body: "Every question is tagged to the 2026 NCSBN test plan: client need, sub-category, integrated process, and the CJMM step it tests. Your dashboard reflects that taxonomy exactly, so what you practice on Monday is the same thing the exam measures in May.",
  },
  {
    kicker: "Principle IV",
    title: "Your data stays yours.",
    body: "We don't sell your study data. We don't share it with advertisers. You can export everything you've ever done as a single zip file from your settings page. Account deletion is a real delete, not a hidden archive.",
  },
];

export default function AboutPage() {
  return (
    <PageFrame>
      {/* faint botanical mark, opposite side from home */}
      <Botanical
        aria-hidden
        className="pointer-events-none absolute -left-32 top-[420px] -z-10 h-[560px] w-[560px] -scale-x-100 text-sage-100/65 sm:-left-20 lg:left-[-40px]"
      />

      <Container>
        <section className="pb-20 pt-20 sm:pt-28 lg:pt-32">
          <div className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 lg:col-span-3">
              <Eyebrow>Our approach</Eyebrow>
            </div>
            <div className="col-span-12 lg:col-span-9 lg:col-start-4">
              <h1 className="max-w-[22ch] font-display text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.04] tracking-[-0.03em] text-ink">
                Built for a real person, in a real{" "}
                <em className="font-display italic text-lavender-600">stretch of months.</em>
              </h1>
              <p className="mt-8 max-w-[58ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft">
                NECLEX began as a study tool for one nursing student — a partner working through the
                program, anxious about the test, frustrated with prep apps that felt loud and
                generic. The earliest version was a folder of song mnemonics and a spreadsheet of
                drug cards. It grew into this because the studying worked, and because a calmer
                tool deserved to exist for everyone walking the same path.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="principles" className="pb-20">
          <h2 id="principles" className="sr-only">
            Principles
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {principles.map((p) => (
              <article
                key={p.kicker}
                className="rounded-2xl border border-ink/10 bg-paper-deep/40 p-8 sm:p-10"
              >
                <Eyebrow withRule={false}>{p.kicker}</Eyebrow>
                <h3 className="mt-4 max-w-[20ch] font-display text-[clamp(1.5rem,2.6vw,2rem)] font-light leading-[1.15] tracking-[-0.02em] text-ink">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-[52ch] font-body text-[15.5px] leading-[1.65] text-ink-soft">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-12">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8 rounded-2xl border border-ink/10 bg-lavender-50/60 px-6 py-12 sm:px-10 sm:py-16">
            <div className="col-span-12 lg:col-span-7">
              <Eyebrow withRule={false}>One last thing</Eyebrow>
              <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-light leading-[1.12] tracking-[-0.02em] text-ink">
                You&rsquo;re not alone, and you&rsquo;re not behind. You&rsquo;re early, and that
                matters.
              </h2>
              <p className="mt-5 max-w-[58ch] font-body text-[15.5px] leading-[1.65] text-ink-soft">
                Nursing school is hard, the NCLEX is harder, and the students who walk in calm are
                almost always the ones who started preparing before they felt ready. Whatever
                month you&rsquo;re in, today is a fine day to begin.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/start" arrow>
                  Begin a quiet session
                </Button>
                <Button href="/method" variant="ghost" size="sm">
                  <span className="link-draw">Read the method</span>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
