import { createFileRoute } from "@tanstack/react-router";

import { QuizPage } from "@/components/kelly/quiz-page";

export const Route = createFileRoute("/_authenticated/quizzes")({
  component: QuizPage,
});
