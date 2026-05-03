import Link from "next/link";
import { Botanical } from "@/components/marks/botanical";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const queues = [
  {
    href: "/study",
    title: "Practice",
    body: "Single-best-answer and select-all questions, source-cited, randomized every set.",
    accent: "lavender",
    cta: "Start a set",
  },
  {
    href: "/notes",
    title: "From your notes",
    body: "Paste or upload your own notes — get a quiz back, in any of the NCLEX item types, up to 100 questions.",
    accent: "sage",
    cta: "Make a quiz",
  },
  {
    href: "/reference",
    title: "Reference",
    body: "Drug cards, lab values, and mnemonics.",
    accent: "clay",
    cta: "Open the cabinet",
  },
] as const;

const accentBg = {
  lavender: "bg-lavender-50",
  clay: "bg-clay-50",
  sage: "bg-sage-50",
} as const;

export default function HomePage() {
  return (
    <PageFrame withAtmosphere>
      <Botanical
        aria-hidden
        className="pointer-events-none absolute -right-32 top-[280px] -z-10 h-[680px] w-[680px] text-lavender-200/55 sm:-right-20 lg:right-0"
      />

      <Container>
        <section className="pb-16 pt-20 sm:pt-28">
          <Eyebrow>{today}</Eyebrow>
          <h1 className="mt-5 max-w-[20ch] font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[1.04] tracking-[-0.035em] text-ink">
            NCLEX study, in your own time.
          </h1>
          <p className="mt-7 max-w-[52ch] font-body text-[1.0625rem] leading-[1.6] text-ink-soft">
            Pick a study set or open the reference. Both work on phone or laptop. Untimed by default.
          </p>
        </section>

        <section aria-labelledby="queues" className="pb-16">
          <h2 id="queues" className="sr-only">
            Pick where to go
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {queues.map((q) => (
              <Link
                key={q.title}
                href={q.href}
                className={`group lift relative flex flex-col justify-between rounded-2xl border border-ink/10 ${accentBg[q.accent]} p-7 sm:p-8`}
              >
                <div>
                  <p className="font-display text-[1.625rem] font-light leading-[1.18] tracking-[-0.02em] text-ink">
                    {q.title}
                  </p>
                  <p className="mt-3 max-w-[40ch] font-body text-[15px] leading-[1.55] text-ink-soft">
                    {q.body}
                  </p>
                </div>
                <p className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                  {q.cta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
