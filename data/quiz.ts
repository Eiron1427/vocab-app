import { LESSON_DATA } from "@/data/lesson";
import type { LessonDefinition } from "@/types/lesson";
import type { QuizQuestion } from "@/types/quiz";

function questionsForLesson(lesson: LessonDefinition): QuizQuestion[] {
    const words = [...new Map(
        lesson.levels.flatMap((level) => level.words.map((item) => [item.word.trim().toLowerCase(), item] as const)),
    ).values()];
    if (words.length < 2) return [];

    return words.map((correct, index) => {
        // Stable order so a saved attempt can resume with the same choices.
        const options = [
            correct.word,
            ...words.slice(index + 1).concat(words.slice(0, index)).slice(0, 3).map((item) => item.word),
        ];
        const answer = index % options.length;
        [options[0], options[answer]] = [options[answer], options[0]];
        return {
            prompt: lesson.ageGroup === "3-6"
                ? `${correct.emoji} Which word matches? ${correct.meaning}`
                : `Which word means: ${correct.meaning}`,
            options,
            answer,
        };
    });
}

export const QUIZ_TITLES: Record<string, string> = Object.fromEntries(
    LESSON_DATA.map((lesson) => [String(lesson.id), lesson.title]),
);
export const QUIZZES: Record<string, readonly QuizQuestion[]> = Object.fromEntries(
    LESSON_DATA.map((lesson) => [String(lesson.id), questionsForLesson(lesson)])
        .filter(([, questions]) => questions.length > 0),
);
