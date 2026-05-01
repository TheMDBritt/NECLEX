import type { Metadata } from "next";
import { Button } from "@/components/primitives/button";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for serious study. Start free, go monthly, or commit to the test-month crash course.",
};

interface Tier {
  name: string;
  price: string;
  cadence: string;
  pull: string;
  features: string[];
  cta: { label: string; href: string };
  emphasis?: boolean;
  ribbon?: string;
}

const tiers: Tier[] = [
  {
    name: "Quiet hours",
    price: "$0",
    cadence: "free, always",
    pull: "Enough to study from, never enough to feel guilty about.",
    features: [
      "25 practice questions / day",
      "Drug & lab reference (read-only)",
      "Mnemonic library (ten songs)",
      "Streak tracking with no shame",
    ],
    cta: { label: "Start for free", href: "/start" },
  },
  {
    name: "Steady study",
    price: "$24",
    cadence: "per month",
    pull: "The shape most people use — a calm, daily study companion.",
    features: [
      "Unlimited practice & case studies",
      "All NGN item types, all six CJMM steps",
      "FSRS spaced repetition",
      "Drug, lab, and mnemonic library in full",
      "Weekly mastery digest",
      "Cancel any time",
    ],
    cta: { label: "Begin a quiet session", href: "/start" },
    emphasis: true,
    ribbon: "Most chosen",
  },
  {
    name: "Crash course",
    price: "$79",
    cadence: "one-time, 30 days",
    pull: "For the month before your test date — focused, steady, finite.",
    features: [
      "Everything in Steady study",
      "Daily 25-item warm-up auto-built",
      "Two full CAT-simulation exams",
      "Priority email support within 24h",
      "Test-day calm playbook",
    ],
    cta: { label: "Start the 30 days", href: "/start?plan=crash" },
  },
];

export default function PricingPage() {
  return (
    <PageFrame>
      <Container>
        <section className="pb-20 pt-20 sm:pt-28 lg:pt-32">
          <div className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 lg:col-span-3">
              <Eyebrow>Pricing</Eyebrow>
            </div>
            <div className="col-span-12 lg:col-span-9 lg:col-start-4">
              <h1 className="max-w-[20ch] font-display text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.04] tracking-[-0.03em] text-ink">
                Simple pricing for{" "}
                <em className="font-display italic text-lavender-600">serious study.</em>
              </h1>
              <p className="mt-8 max-w-[52ch] font-body text-[1.0625rem] leading-[1.65] text-ink-soft">
                Free always exists. The paid tiers fund the people who write the rationales, verify
                every drug fact, and keep the engine current with the NCSBN test plan. No hidden
                fees, no auto-upgrades, refund within fourteen days if it&rsquo;s not for you.
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Plans" className="pb-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-8 sm:p-10 ${
                  tier.emphasis
                    ? "border-ink/15 bg-paper shadow-[var(--shadow-soft)]"
                    : "border-ink/10 bg-paper/70"
                }`}
              >
                {tier.ribbon ? (
                  <span className="absolute -top-3 left-8 rounded-full bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-paper">
                    {tier.ribbon}
                  </span>
                ) : null}

                <h2 className="font-display text-[1.625rem] font-light leading-[1.15] tracking-[-0.02em] text-ink">
                  {tier.name}
                </h2>
                <p className="mt-2 font-display text-[15px] italic leading-[1.45] text-lavender-600">
                  {tier.pull}
                </p>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="font-display text-[clamp(2.75rem,5vw,3.75rem)] font-light leading-none tracking-[-0.03em] text-ink">
                    {tier.price}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
                    {tier.cadence}
                  </span>
                </div>

                <ul className="mt-8 space-y-3 border-t border-ink/10 pt-6">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 font-body text-[14.5px] leading-[1.55] text-ink"
                    >
                      <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sage-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-2">
                  <Button
                    href={tier.cta.href}
                    variant={tier.emphasis ? "primary" : "outline"}
                    arrow
                    className="w-full justify-center"
                  >
                    {tier.cta.label}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="pricing-faq" className="pb-12">
          <div className="grid grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <Eyebrow>Plain answers</Eyebrow>
              <h2
                id="pricing-faq"
                className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-light leading-[1.12] tracking-[-0.02em] text-ink"
              >
                Things most people ask before they sign up.
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <dl className="divide-y divide-ink/10 border-y border-ink/10">
                {[
                  {
                    q: "What if I fail the NCLEX?",
                    a: "Email us within 30 days of your result with a copy of your candidate report. We extend your subscription for sixty days at no cost so you can re-take with the same dashboard, mastery, and streak credits intact.",
                  },
                  {
                    q: "Is there a student discount?",
                    a: "Yes — currently enrolled nursing students get the Steady study plan for $14 / month. Verify with your .edu email or upload a current student ID at checkout.",
                  },
                  {
                    q: "Can I cancel?",
                    a: "Whenever you want, in two clicks. You keep access until the end of the billing month, and your account never disappears — just goes quiet.",
                  },
                  {
                    q: "Do you sell my data?",
                    a: "No. We never sell, share, or rent your study data. The only place it lives is in your account, and you can export everything as a single zip whenever you want.",
                  },
                ].map((row) => (
                  <div key={row.q} className="grid grid-cols-1 gap-4 py-7 sm:grid-cols-12">
                    <dt className="font-display text-[1.125rem] leading-[1.3] tracking-[-0.01em] text-ink sm:col-span-5">
                      {row.q}
                    </dt>
                    <dd className="font-body text-[15px] leading-[1.65] text-ink-soft sm:col-span-7">
                      {row.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
