import { LessonModel } from "@/models/lesson";
import type { LessonDefinition } from "@/types/lesson";

export class LessonService {
    private readonly lessons: readonly LessonModel[];

    constructor(data: readonly LessonDefinition[]) {
        this.lessons = data.map((lesson) => new LessonModel(lesson));
    }

    getLessons(): readonly LessonModel[] {
        return this.lessons;
    }

    getLesson(lessonId: number): LessonModel {
        const lesson = this.lessons.find(
            (item) => item.id === lessonId,
        );

        if (!lesson) {
            throw new Error(`Lesson ${lessonId} was not found.`);
        }

        return lesson;
    }

    isLessonUnlocked(
        lessonId: number,
        completed: readonly string[],
    ): boolean {
        const index = this.lessons.findIndex(
            (lesson) => lesson.id === lessonId,
        );

        return (
            index >= 0 &&
            this.lessons
                .slice(0, index)
                .every((lesson) => lesson.isCompleted(completed))
        );
    }

    canOpenLevel(
        lessonId: number,
        levelId: number,
        completed: readonly string[],
    ): boolean {
        if (!this.isLessonUnlocked(lessonId, completed)) {
            return false;
        }

        const lesson = this.getLesson(lessonId);
        const index = lesson.levels.findIndex(
            (level) => level.id === levelId,
        );

        if (index < 0 || !lesson.levels[index].words.length) {
            return false;
        }

        return lesson.levels
            .slice(0, index)
            .every((level) =>
                lesson.isLevelCompleted(level.id, completed),
            );
    }

    completeLevel(
        lessonId: number,
        levelId: number,
        completed: readonly string[],
    ): string[] {
        if (!this.canOpenLevel(lessonId, levelId, completed)) {
            return [...completed];
        }

        const key = this.getLesson(lessonId).completionKey(levelId);

        return completed.includes(key)
            ? [...completed]
            : [...completed, key];
    }
}