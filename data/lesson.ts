import type { LessonDefinition, VocabItem, } from "@/types/lesson"
import type { AgeGroup } from "@/types/age-group";

const starterLevels: readonly VocabItem[][] = [
    [

        { word: 'apple', meaning: 'A round fruit that grows on trees.', emoji: '🍎', },
        { word: 'banana', meaning: 'A long curved yellow fruit with a sweet taste.', emoji: '🍌', },
        { word: 'carrot', meaning: 'A crunchy orange root vegetable packed with vitamins.', emoji: '🥕', },
    ]
];

export const LESSON_DATA: readonly LessonDefinition[] = [
    ...Array.from({ length: 10 }, (_, lessonIndex): LessonDefinition => ({
        id: lessonIndex + 1,
        ageGroup: "3-6",
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
    })),
    {
        id: 11,
        ageGroup: "7-12",
        title: "Lesson 1: Exploring Nature",
        levels: [{
            id: 1,
            words: [
                { word: "habitat", meaning: "The natural home of a plant or animal.", emoji: "🌳" },
                { word: "migration", meaning: "Moving from one place to another, often when the seasons change.", emoji: "🦅" },
                { word: "observe", meaning: "To watch or look at something carefully.", emoji: "🔍" },
            ],
        }],
    },
    {
        id: 21,
        ageGroup: "13+",
        title: "Lesson 1: Thinking and Communicating",
        levels: [{
            id: 1,
            words: [
                { word: "evaluate", meaning: "To judge the quality or value of something after looking at it carefully.", emoji: "📋" },
                { word: "perspective", meaning: "A particular way of looking at or thinking about something.", emoji: "💭" },
                { word: "infer", meaning: "To reach a conclusion based on clues or evidence.", emoji: "🧩" },
            ],
        }],
    },
];

export function lessonsForAgeGroup(ageGroup?: AgeGroup) {
    return LESSON_DATA.filter((lesson) => lesson.ageGroup === ageGroup);
}
