import Link from "next/link";
import { Botanical } from "@/components/marks/botanical";
import { Wordmark } from "@/components/marks/wordmark";
import { RevealHeading } from "@/components/marks/reveal-heading";

export default function HomePage() {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-paper text-ink">
      {/* Soft top wash — paper warmed slightly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-b from-clay-50/70 via-paper to-paper"
      />

      {/* Decorative botanical mark — lower right, lavender wash */}
      <Botanical
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-[-180px] -z-10 h-[680px] w-[680px] text-lavender-200/65 sm:-right-20 lg:right-0"
      />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 pt-8 sm:px-10 sm:pt-10">
        <Wordmark />
        <nav className="hidden items-center gap-9 font-body text-[14px] tracking-[0.02em] text-ink-soft sm:flex">
          <Link href="/about" className="link-draw">
            Our approach
          </Link>
          <Link href="/method" className="link-draw">
            The method
          </Link>
          <Link href="/pricing" className="link-draw">
            Pricing
          </Link>
        </nav>
        <Link
          href="/sign-in"
          className="rounded-full border border-ink/15 bg-paper/70 px-5 py-2 font-body text-[14px] tracking-[0.01em] text-ink backdrop-blur-sm transition-colors duration-300 hover:border-ink/35 hover:bg-paper"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-32 pt-24 sm:px-10 sm:pt-32 lg:pt-40">
        <div className="grid grid-cols-12 gap-y-16">
          {/* Eyebrow */}
          <div
            className="col-span-12 reveal-fade lg:col-span-3"
            style={{ ["--reveal-i" as string]: 0 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
              <span className="mr-3 inline-block h-px w-7 translate-y-[-3px] bg-ink-faint align-middle" />
              For the NCLEX-RN &amp; NCLEX-PN
            </p>
          </div>

          {/* Display heading */}
          <div className="col-span-12 lg:col-span-9 lg:col-start-4">
            <h1 className="font-display text-[clamp(2.75rem,7.2vw,7rem)] font-light leading-[1.02] tracking-[-0.035em] text-ink">
              <RevealHeading
                lines={[
                  ["A", "calmer", "way"],
                  ["to", "study", "for"],
                  ["the", <em key="x" className="font-display italic text-lavender-600">NCLEX.</em>],
                ]}
              />
            </h1>
          </div>

          {/* Subhead — hangs in negative space, narrow column on right */}
          <div className="col-span-12 mt-6 lg:col-span-5 lg:col-start-7">
            <p
              className="reveal-fade max-w-[44ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft"
              style={{ ["--reveal-i" as string]: 9 }}
            >
              Built around how <em className="not-italic text-ink">you</em> actually learn — songs,
              visuals, real reps. Anchored in the 2026 NCSBN test plan, every rationale cited.
              Quietly relentless about getting you ready.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="reveal-fade col-span-12 mt-10 flex flex-wrap items-center gap-4 lg:col-span-5 lg:col-start-7"
            style={{ ["--reveal-i" as string]: 10 }}
          >
            <Link
              href="/start"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 font-body text-[15px] tracking-[0.01em] text-paper transition-colors duration-300 hover:bg-indigo-deep"
            >
              Begin a quiet session
              <span
                aria-hidden
                className="inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href="/method"
              className="link-draw inline-flex items-center gap-2 px-1 font-body text-[15px] tracking-[0.01em] text-ink-soft"
            >
              How the method works
            </Link>
          </div>

          {/* Bottom strip — three quiet promises */}
          <div className="col-span-12 mt-24 grid grid-cols-1 gap-y-8 border-t border-ink/10 pt-10 sm:grid-cols-3 sm:gap-x-8 lg:mt-32">
            {[
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
            ].map((promise, i) => (
              <article
                key={promise.kicker}
                className="reveal-fade flex flex-col gap-3"
                style={{ ["--reveal-i" as string]: 11 + i }}
              >
                <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                  {promise.kicker}
                </p>
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

      {/* Footer mark */}
      <footer className="relative z-10 mx-auto flex w-full max-w-[1280px] items-end justify-between gap-6 px-6 pb-10 sm:px-10">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          Not affiliated with NCSBN or Pearson VUE · Educational use only
        </p>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
          MMXXVI
        </p>
      </footer>
    </main>
  );
}
