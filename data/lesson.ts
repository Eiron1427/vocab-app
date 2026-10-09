import type { LessonDefinition, VocabItem, } from "@/types/lesson"

const starterLevels: readonly VocabItem[][] = [
    [

        { word: 'apple', meaning: 'A round fruit that grows on trees.', emoji: '🍎', },
        { word: 'banana', meaning: 'A long curved yellow fruit with a sweet taste.', emoji: '🍌', },
        { word: 'carrot', meaning: 'A crunchy orange root vegetable packed with vitamins.', emoji: '🥕', },
    ]
];

export const LESSON_DATA: readonly LessonDefinition[] =
    Array.from({ length: 10 }, (_, lessonIndex) => ({
        id: lessonIndex + 1,
        title:
            lessonIndex === 0
                ? "Lesson 1: Food"
                : `Lesson ${lessonIndex + 1}`,
        levels: Array.from({ length: 10 }, (_, levelIndex) => ({
            id: levelIndex + 1,
            words:
                lessonIndex === 0
                    ? starterLevels[levelIndex] ?? []
                    : [],
        })),
    }));
