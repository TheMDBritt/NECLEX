import { Button } from "@/components/primitives/button";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { PageFrame } from "@/components/shell/page-frame";

export default function NotFound() {
  return (
    <PageFrame>
      <Container size="md">
        <section className="pb-16 pt-24 sm:pt-32">
          <Eyebrow>404</Eyebrow>
          <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.06] tracking-[-0.03em] text-ink">
            Nothing here.
          </h1>
          <p className="mt-5 max-w-[52ch] font-body text-[1rem] leading-[1.6] text-ink-soft">
            That page doesn't exist or has moved. Head back home and pick a study set, or open the
            reference cabinet.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/" arrow>
              Home
            </Button>
            <Button href="/study" variant="outline" size="sm">
              Open study
            </Button>
          </div>
        </section>
      </Container>
    </PageFrame>
  );
}
