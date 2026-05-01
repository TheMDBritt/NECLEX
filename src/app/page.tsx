import { Botanical } from "@/components/marks/botanical";
import { RevealHeading } from "@/components/marks/reveal-heading";
import { Button } from "@/components/primitives/button";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

const promises = [
  {
    kicker: "01 — Calm",
    title: "Soft on the nervous system",
    body: "No alarm-red. No shaming streaks. Optional untimed practice. Breathing breaks built in.",
  },
  {
    kicker: "02 — Accurate",
    title: "Sourced, not invented",
    body: "Every rationale traces to NCSBN, FDA labeling, or a current clinical guideline. No AI guesses.",
  },
  {
    kicker: "03 — Adaptive",
    title: "Tuned to your weak spots",
    body: "Spaced repetition with FSRS. Mastery tracked across all six clinical-judgment steps.",
  },
];

export default function HomePage() {
  return (
    <PageFrame withAtmosphere>
      {/* Decorative botanical mark — lower right, lavender wash */}
      <Botanical
        aria-hidden
        className="pointer-events-none absolute -right-32 top-[280px] -z-10 h-[680px] w-[680px] text-lavender-200/65 sm:-right-20 lg:right-0"
      />

      <Container>
        <section className="pb-32 pt-24 sm:pt-32 lg:pt-40">
          <div className="grid grid-cols-12 gap-y-16">
            <div
              className="reveal-fade col-span-12 lg:col-span-3"
              style={{ ["--reveal-i" as string]: 0 }}
            >
              <Eyebrow>For the NCLEX-RN &amp; NCLEX-PN</Eyebrow>
            </div>

            <div className="col-span-12 lg:col-span-9 lg:col-start-4">
              <h1 className="font-display text-[clamp(2.75rem,7.2vw,7rem)] font-light leading-[1.02] tracking-[-0.035em] text-ink">
                <RevealHeading
                  lines={[
                    ["A", "calmer", "way"],
                    ["to", "study", "for"],
                    [
                      "the",
                      <em key="x" className="font-display italic text-lavender-600">
                        NCLEX.
                      </em>,
                    ],
                  ]}
                />
              </h1>
            </div>

            <div className="col-span-12 mt-6 lg:col-span-5 lg:col-start-7">
              <p
                className="reveal-fade max-w-[44ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft"
                style={{ ["--reveal-i" as string]: 9 }}
              >
                Built around how <em className="not-italic text-ink">you</em> actually learn —
                songs, visuals, real reps. Anchored in the 2026 NCSBN test plan, every rationale
                cited. Quietly relentless about getting you ready.
              </p>
            </div>

            <div
              className="reveal-fade col-span-12 mt-10 flex flex-wrap items-center gap-4 lg:col-span-5 lg:col-start-7"
              style={{ ["--reveal-i" as string]: 10 }}
            >
              <Button href="/start" arrow>
                Begin a quiet session
              </Button>
              <Button href="/method" variant="ghost" size="sm">
                <span className="link-draw">How the method works</span>
              </Button>
            </div>

            <div className="col-span-12 mt-24 grid grid-cols-1 gap-y-8 border-t border-ink/10 pt-10 sm:grid-cols-3 sm:gap-x-8 lg:mt-32">
              {promises.map((promise, i) => (
                <article
                  key={promise.kicker}
                  className="reveal-fade flex flex-col gap-3"
                  style={{ ["--reveal-i" as string]: 11 + i }}
                >
                  <Eyebrow withRule={false}>{promise.kicker}</Eyebrow>
                  <h3 className="font-display text-[1.5rem] leading-[1.18] tracking-[-0.02em] text-ink">
                    {promise.title}
                  </h3>
                  <p className="max-w-[34ch] font-body text-[15px] leading-[1.6] text-ink-soft">
                    {promise.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
