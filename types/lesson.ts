import type { AgeGroup } from "./age-group";

export interface Lesson {
    id: number;
    title: string;
    level: string;
    unlocked: boolean;
    progressCount: number;
    maxProgress: number;
}

export interface VocabItem {
    word: string;
    meaning: string;
    emoji: string;
}

export interface LevelDefinition {
    id: number;
    words: readonly VocabItem[];
}

export interface LessonDefinition {
    id: number;
    ageGroup: AgeGroup;
    title: string
    levels: readonly LevelDefinition[]
}
