import type { Metadata } from "next";
import { Container } from "@/components/primitives/container";
import { PageFrame } from "@/components/shell/page-frame";
import { StudyPicker } from "@/components/quiz/study-picker";
import { seedSession } from "@/lib/content/seed-items";

export const metadata: Metadata = {
  title: "Study",
};

export default function StudyPage() {
  return (
    <PageFrame>
      <Container size="md">
        <section className="pb-16 pt-12 sm:pt-16">
          <StudyPicker bank={seedSession} />
        </section>
      </Container>
    </PageFrame>
  );
}
