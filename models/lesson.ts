import type { LessonDefinition } from "@/types/lesson";

export class LessonModel {
    constructor(private readonly data: LessonDefinition) { }

    get id() {
        return this.data.id;
    }

    get title() {
        return this.data.title;
    }

    get levels() {
        return this.data.levels;
    }

    get totalLevels() {
        return this.data.levels.length;
    }

    getLevel(levelId: number) {
        return this.data.levels.find((level) => level.id === levelId);
    }

    completionKey(levelId: number): string {
        return `${this.id}:${levelId}`;
    }

    isLevelCompleted(
        levelId: number,
        completed: readonly string[],
    ): boolean {
        return completed.includes(this.completionKey(levelId));
    }

    completedCount(completed: readonly string[]): number {
        return this.levels.filter((level) =>
            this.isLevelCompleted(level.id, completed),
        ).length;
    }

    isCompleted(completed: readonly string[]): boolean {
        return (
            this.totalLevels > 0 &&
            this.completedCount(completed) === this.totalLevels
        );
    }
}