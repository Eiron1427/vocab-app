"use client";
import { useMemo, useSyncExternalStore } from "react";
import { QuizModel } from "@/models/quiz";
import { QuizRepository } from "@/repositories/quiz-repository";
import { quizRepository } from "@/lib/quiz-services";
const snapshot = () => quizRepository.snapshot();
const serverSnapshot = () => null;
const noopSubscribe = () => () => { };
const clientReady = () => true;
const serverReady = () => false;
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener(QuizRepository.event, callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(QuizRepository.event, callback);
    };
}
export function useQuiz() {
    const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
    const ready = useSyncExternalStore(noopSubscribe, clientReady, serverReady);
    const state = useMemo(() => QuizModel.parse(raw), [raw]);
    return { state, ready };
}
