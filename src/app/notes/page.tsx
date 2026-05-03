import type { Metadata } from "next";
import { Container } from "@/components/primitives/container";
import { PageFrame } from "@/components/shell/page-frame";
import { NotesQuiz } from "@/components/quiz/notes-quiz";

export const metadata: Metadata = {
  title: "Quiz from notes",
};

export default function NotesPage() {
  return (
    <PageFrame>
      <Container size="md">
        <section className="pb-16 pt-12 sm:pt-16">
          <NotesQuiz />
        </section>
      </Container>
    </PageFrame>
  );
}
