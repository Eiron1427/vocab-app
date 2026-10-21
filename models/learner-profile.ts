import type { ProfileData, ProfileSummaryItem } from "@/types/profile";
import type { AppState } from "@/types/app-state";
import type { QuizState } from "@/types/quiz";
import { LESSON_DATA } from "@/data/lesson";
import { QUIZZES, QUIZ_TITLES } from "@/data/quiz";
import { clampPercentage } from "@/lib/util";
const percent = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

export class LearnerProfile {
  private readonly data: ProfileData;
  constructor(data: ProfileData) {
    this.data = {
      ...data,
      levelProgress: clampPercentage(data.levelProgress),
      stats: data.stats.map((item) => ({ ...item })),
      progress: data.progress.map((item) => ({
        ...item,
        pct: clampPercentage(item.pct),
      })),
      summary: data.summary.map((item) => ({ ...item })),
    };
  }
  static fromState(app: AppState, quiz: QuizState): LearnerProfile {
    const completed = new Set(app.completedLevels);
    let availableLevels = 0,
      completedLevels = 0,
      completedLessons = 0;
    const words = new Set<string>();
    const summary: ProfileSummaryItem[] = [];
    for (const lesson of LESSON_DATA) {
      const available = lesson.levels.filter((level) => level.words.length > 0);
      const done = available.filter((level) =>
        completed.has(`${lesson.id}:${level.id}`),
      );
      availableLevels += available.length;
      completedLevels += done.length;
      // Match the lesson screen: every defined level must be completed.
      if (lesson.levels.length > 0 && done.length === lesson.levels.length)
        completedLessons++;
      for (const level of done)
        for (const word of level.words)
          words.add(word.word.trim().toLowerCase());
      if (done.length)
        summary.push({
          id: `lesson-${lesson.id}`,
          kind: "lesson",
          title: lesson.title,
          detail: `${done.length}/${lesson.levels.length} levels completed`,
          href: "/lessons",
        });
    }
    const quizIds = Object.keys(QUIZZES).filter((id) => QUIZZES[id].length > 0);
    const completedIds = quizIds.filter(
      (id) => (quiz.progress[id] ?? 0) >= QUIZZES[id].length,
    );
    const results = quizIds.flatMap((id) =>
      quiz.results[id] ? [quiz.results[id]] : [],
    );
    const average = results.length
      ? Math.round(
          results.reduce(
            (sum, result) => sum + (result.score / result.total) * 100,
            0,
          ) / results.length,
        )
      : null;
    for (const id of quizIds) {
      const answered = quiz.progress[id] ?? 0;
      const result = quiz.results[id];
      if (!answered && !result) continue;
      summary.push({
        id: `quiz-${id}`,
        kind: "quiz",
        title: `Quiz: ${QUIZ_TITLES[id] ?? `Lesson ${id}`}`,
        detail: result
          ? `Latest completed score: ${result.score}/${result.total} (${percent(result.score, result.total)}%)`
          : answered >= QUIZZES[id].length
            ? "Completed · previous score not recorded"
            : `${answered}/${QUIZZES[id].length} questions answered`,
        href: `/quizzes/play?lesson=${id}`,
      });
    }
    return new LearnerProfile({
      displayName: app.profile.username,
      levelProgress: percent(
        completedLevels + completedIds.length,
        availableLevels + quizIds.length,
      ),
      scoredQuizzes: results.length,
      completedQuizzes: completedIds.length,
      stats: [
        {
          metric: "lessons",
          value: String(completedLessons),
          label: "Lessons\nCompleted",
        },
        {
          metric: "score",
          value: average === null ? "—" : `${average}%`,
          label: "Average\nScore",
        },
        {
          metric: "quizzes",
          value: String(completedIds.length),
          label: "Quizzes\nCompleted",
        },
        { metric: "words", value: String(words.size), label: "Words\nLearned" },
      ],
      progress: [
        {
          metric: "levels",
          label: "Available lesson levels",
          pct: percent(completedLevels, availableLevels),
          right: `${completedLevels}/${availableLevels}`,
        },
        {
          metric: "quizzes",
          label: "Available quizzes completed",
          pct: percent(completedIds.length, quizIds.length),
          right: `${completedIds.length}/${quizIds.length}`,
        },
        {
          metric: "score",
          label: "Average completed quiz score",
          pct: average ?? 0,
          right: average === null ? "—" : `${average}%`,
        },
      ],
      summary,
    });
  }
  toView(): ProfileData {
    return {
      ...this.data,
      stats: this.data.stats.map((item) => ({ ...item })),
      progress: this.data.progress.map((item) => ({ ...item })),
      summary: this.data.summary.map((item) => ({ ...item })),
    };
  }
}
