import type { QuizQuestion } from "@/types/quiz";
export const QUIZ_TITLES: Record<string, string> = {
    "1": "Fruit",
    "2": "Feelings",
};
export const QUIZZES: Record<string, readonly QuizQuestion[]> = {
    "1": [
        {
            prompt: "Which fruit is long and yellow?",
            options: ["Apple", "Banana", "Grapes", "Lemon"],
            answer: 1,
        },
        {
            prompt: "Which fruit is red and grows on trees?",
            options: ["Banana", "Lemon", "Apple", "Pear"],
            answer: 2,
        },
        {
            prompt: "Which fruit tastes sour?",
            options: ["Lemon", "Orange", "Mango", "Watermelon"],
            answer: 0,
        },
        {
            prompt: "Which fruit grows in bunches?",
            options: ["Mango", "Pear", "Lemon", "Grapes"],
            answer: 3,
        },
        {
            prompt: "Which fruit is green outside and red inside?",
            options: ["Pineapple", "Watermelon", "Mango", "Orange"],
            answer: 1,
        },
        {
            prompt: "Which fruit has spiky skin?",
            options: ["Pineapple", "Strawberry", "Pear", "Orange"],
            answer: 0,
        },
        {
            prompt: "Which fruit has tiny seeds on the outside?",
            options: ["Mango", "Grapes", "Strawberry", "Lemon"],
            answer: 2,
        },
        {
            prompt: "Which sweet tropical fruit has a big seed?",
            options: ["Orange", "Banana", "Pear", "Mango"],
            answer: 3,
        },
        {
            prompt: "Which fruit has orange skin and is juicy?",
            options: ["Pear", "Orange", "Apple", "Lemon"],
            answer: 1,
        },
        {
            prompt: "Which fruit is wide at the bottom and narrow at the top?",
            options: ["Apple", "Lemon", "Pear", "Grapes"],
            answer: 2,
        },
    ],
    "2": [
        {
            prompt: "What is the other word for happy?",
            options: ["Sad", "Angry", "Joyful", "Tired"],
            answer: 2,
        },
        {
            prompt: "What is the opposite of happy?",
            options: ["Sad", "Joyful", "Glad", "Cheerful"],
            answer: 0,
        },
        {
            prompt: "How do you feel when you are very sleepy?",
            options: ["Tired", "Excited", "Brave", "Proud"],
            answer: 0,
        },
        {
            prompt: "Which word means very angry?",
            options: ["Calm", "Furious", "Sleepy", "Shy"],
            answer: 1,
        },
        {
            prompt: "What is the other word for scared?",
            options: ["Afraid", "Proud", "Happy", "Silly"],
            answer: 0,
        },
        {
            prompt: "How do you feel when you win a game?",
            options: ["Sad", "Bored", "Proud", "Lonely"],
            answer: 2,
        },
        {
            prompt: "What is the opposite of calm?",
            options: ["Peaceful", "Relaxed", "Worried", "Quiet"],
            answer: 2,
        },
        {
            prompt: "What is the other word for glad?",
            options: ["Upset", "Pleased", "Angry", "Afraid"],
            answer: 1,
        },
        {
            prompt: "How do you feel when you have nothing to do?",
            options: ["Bored", "Excited", "Surprised", "Thankful"],
            answer: 0,
        },
        {
            prompt:
                "Which word describes someone who feels nervous around new people?",
            options: ["Brave", "Loud", "Shy", "Proud"],
            answer: 2,
        },
    ],
};
