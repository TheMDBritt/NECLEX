import type { Metadata } from "next";
import { Container } from "@/components/primitives/container";
import { PageFrame } from "@/components/shell/page-frame";
import { StudySession } from "@/components/quiz/study-session";
import { seedSession } from "@/lib/content/seed-items";

export const metadata: Metadata = {
  title: "Study",
};

export default function StudyPage() {
  return (
    <PageFrame>
      <Container size="md">
        <section className="pb-16 pt-12 sm:pt-16">
          <StudySession items={seedSession} />
          <p className="mt-12 text-center font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
            Take a breath between items. There's no rush.
          </p>
        </section>
      </Container>
    </PageFrame>
  );
}
