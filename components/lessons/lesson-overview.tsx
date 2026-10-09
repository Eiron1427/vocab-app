"use client";

import React, { useState } from 'react';
import {
    BookOpen, Lock, ArrowLeft, Sparkles,
    Volume2, ArrowRight, PartyPopper,
} from 'lucide-react';
import { LESSON_DATA } from "@/data/lesson";
import { LessonService } from '@/services/lesson-service';
import type { Lesson } from '@/types/lesson'


const lessonService = new LessonService(LESSON_DATA);
export default function LessonOverview() {
    const [currentView, setCurrentView] = useState<
        "lessons" | "levels" | "detail" | "completion"
    >("lessons");

    const [activeLessonId, setActiveLessonId] = useState(1);
    const [activeLevelId, setActiveLevelId] = useState(1);
    const [vocabIndex, setVocabIndex] = useState(0);

    const [completedLevels, setCompletedLevels] =
        useState<string[]>([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const activeLesson =
        lessonService.getLesson(activeLessonId);

    const activeLevel =
        activeLesson.getLevel(activeLevelId);

    const vocabItems = activeLevel?.words ?? [];

    const lessons: Lesson[] = lessonService
        .getLessons()
        .map((lesson) => {
            const count = lesson.completedCount(completedLevels);

            return {
                id: lesson.id,
                title: lesson.title,
                level: `${count}/${lesson.totalLevels} completed`,
                unlocked: lessonService.isLessonUnlocked(
                    lesson.id,
                    completedLevels,
                ),
                progressCount: count,
                maxProgress: lesson.totalLevels,
            };
        });

    const responsiveProgressText =
        `${activeLesson.completedCount(completedLevels)}` +
        `/${activeLesson.totalLevels}`;

    function showNotice(message: string) {
        setAlertMessage(message);
        setShowAlert(true);
    }

    function handleLessonClick(lesson: Lesson) {
        if (!lesson.unlocked) {
            showNotice(
                "Complete all levels in the previous lesson to unlock this lesson.",
            );
            return;
        }

        setActiveLessonId(lesson.id);
        setCurrentView("levels");
    }

    function handleLevelClick(levelId: number) {
        const level = activeLesson.getLevel(levelId);

        if (!level?.words.length) {
            showNotice("This level is coming soon.");
            return;
        }

        if (
            !lessonService.canOpenLevel(
                activeLessonId,
                levelId,
                completedLevels,
            )
        ) {
            showNotice("Complete the previous level first.");
            return;
        }

        setActiveLevelId(levelId);
        setVocabIndex(0);
        setCurrentView("detail");
    }

    function handlePronounce(word: string) {
        if (!("speechSynthesis" in window)) {
            showNotice(
                "Pronunciation is not available in this browser.",
            );
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        utterance.rate = 0.9;

        window.speechSynthesis.speak(utterance);
    }

    function stopPronunciation() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    }

    function handleNextVocab() {
        stopPronunciation();

        if (!vocabItems.length) return;

        if (vocabIndex < vocabItems.length - 1) {
            setVocabIndex((previous) => previous + 1);
            return;
        }

        setCompletedLevels((previous) =>
            lessonService.completeLevel(
                activeLessonId,
                activeLevelId,
                previous,
            ),
        );

        setCurrentView("completion");
    }

    function handlePrevVocab() {
        stopPronunciation();

        if (vocabIndex > 0) {
            setVocabIndex((previous) => previous - 1);
        } else {
            setCurrentView("levels");
        }
    }

    function handleCompleteFinish() {
        setCurrentView("levels");
    }

    function handleBack() {
        stopPronunciation();

        if (currentView === "lessons") {
            showNotice("You are already on the lesson-selection page.");
        } else if (currentView === "levels") {
            setCurrentView("lessons");
        } else {
            setCurrentView("levels");
        }
    }

    return (
        <div className="relative flex w-full flex-col items-center pb-6 font-sans">



            {/* Top Header Navigation Bar */}
            <div className="relative z-10 w-full max-w-md px-6 pt-6 pb-2 flex items-center justify-between">
                <button
                    onClick={handleBack
                    }
                    className="flex items-center gap-2 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 px-4 py-2.5 rounded-full shadow-md font-bold text-sm transition-all transform active:scale-95 border border-stone-200 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <div className="flex items-center gap-1.5 bg-amber-100/95 px-3.5 py-1.5 rounded-full shadow-inner border border-amber-300 text-amber-800 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    <span>Lesson Adventure</span>
                </div>
            </div>

            {/* VIEW 1: SELECT LESSON SCREEN */}
            {currentView === 'lessons' && (
                <div className="relative z-10 w-full max-w-md px-5 pt-2 pb-8 flex flex-col items-center">
                    <div className="w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-white/90 p-6 mt-2">

                        <div className="text-center mb-5">
                            <h1 className="text-3xl font-black text-stone-900 tracking-tight">Select Lesson</h1>
                            <p className="text-stone-600 text-xs font-medium mt-1">Please complete previous lesson to unlock next Lesson</p>
                        </div>

                        <div className="space-y-3 max-h-[64vh] overflow-y-auto pr-1 custom-scrollbar">
                            {lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(lesson)}
                                    className={`relative group flex items-center justify-between px-4 py-3.5 rounded-full cursor-pointer transition-all duration-200 border ${lesson.unlocked
                                        ? 'bg-[#ffd8a8] hover:bg-[#ffe5c4] border-amber-300 shadow-md transform hover:-translate-y-0.5'
                                        : 'bg-stone-300/80 hover:bg-stone-300 border-stone-400/60 opacity-90'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${lesson.unlocked ? 'bg-amber-500 text-white shadow-sm' : 'bg-stone-400 text-stone-100'}`}>
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className={`font-bold text-base ${lesson.unlocked ? 'text-stone-900 font-extrabold' : 'text-stone-600 font-semibold'}`}>
                                            {lesson.title}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!lesson.unlocked && (
                                            <div className="w-8 h-8 rounded-full bg-stone-200/80 flex items-center justify-center shadow-inner">
                                                <Lock className="w-4 h-4 text-stone-700" />
                                            </div>
                                        )}
                                        <span className={`text-sm font-bold ${lesson.unlocked ? 'text-amber-900' : 'text-stone-600'}`}>
                                            {lesson.level}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}

            {currentView === "levels" && (
                <div className="relative z-10 w-full max-w-md px-5 pt-2 pb-8">
                    <section className="mt-2 rounded-[2.5rem] border-4 border-white/90 bg-white/95 p-6 shadow-2xl">
                        <h1 className="text-center text-2xl font-black text-stone-900">
                            {activeLesson.title}
                        </h1>

                        <p className="mt-2 text-center text-sm text-stone-600">
                            Select a level · {responsiveProgressText} completed
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            {activeLesson.levels.map((level) => {
                                const available = level.words.length > 0;

                                const completed = activeLesson.isLevelCompleted(
                                    level.id,
                                    completedLevels,
                                );

                                const unlocked = lessonService.canOpenLevel(
                                    activeLessonId,
                                    level.id,
                                    completedLevels,
                                );

                                const status = !available
                                    ? "Coming soon"
                                    : completed
                                        ? "Completed"
                                        : unlocked
                                            ? "Start"
                                            : "Locked";

                                return (
                                    <button
                                        key={level.id}
                                        type="button"
                                        onClick={() => handleLevelClick(level.id)}
                                        className={`rounded-2xl border p-4 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 ${unlocked
                                            ? "border-amber-300 bg-[#ffd8a8] hover:bg-[#ffe5c4]"
                                            : "border-stone-300 bg-stone-200"
                                            }`}
                                    >
                                        <span className="block font-extrabold text-stone-900">
                                            Level {level.id}
                                        </span>

                                        <span className="mt-1 block text-xs text-stone-700">
                                            {status}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}


            {/* VIEW 2: LESSON ITEM DETAIL VIEW */}
            {currentView === 'detail' && vocabItems[vocabIndex] && (
                <div className="relative z-10 w-full max-w-md px-5 pt-2 pb-8 flex flex-col items-center">
                    <div className="w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-white/90 p-6 mt-2 flex flex-col items-center text-center">

                        {/* Header Titles */}
                        <div className="mb-3">
                            <h1 className="text-2xl font-black text-stone-900">Lesson {activeLessonId}. Word {vocabIndex + 1} of {vocabItems.length}</h1>

                        </div>

                        {/* Illustration Box with Rounded Corners */}
                        <div className="w-48 h-48 bg-white rounded-3xl shadow-sm border border-stone-100 flex items-center justify-center mb-4 relative">
                            <span className="text-8xl select-none animate-bounce">{vocabItems[vocabIndex].emoji}</span>
                        </div>

                        {/* Word and Speaker Icon */}
                        <div
                            onClick={() => handlePronounce(vocabItems[vocabIndex].word)}
                            className="flex items-center justify-center gap-2 mb-5 cursor-pointer group"
                        >
                            <span className="text-4xl font-black text-purple-700 tracking-wide capitalize group-hover:scale-105 transition-transform">
                                {vocabItems[vocabIndex].word}
                            </span>
                            <div className="p-1 text-purple-600 group-hover:scale-110 transition-transform">
                                <Volume2 className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Divider Line */}
                        <div className="w-full h-0.5 bg-stone-300 mb-5"></div>

                        {/* Meaning Section */}
                        <div className="w-full bg-stone-50/90 rounded-2xl p-4 text-left border border-stone-200/60 mb-6 shadow-inner">
                            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-1">
                                <BookOpen className="w-4 h-4 text-stone-700" />
                                <span>Meaning</span>
                            </div>
                            <p className="text-stone-700 text-sm font-medium">
                                {vocabItems[vocabIndex].meaning}
                            </p>
                        </div>

                        {/* Button Layout: Pronounce on left, Next on right */}
                        <div className="w-full grid grid-cols-2 gap-3 mb-3">
                            <button
                                onClick={() => handlePronounce(vocabItems[vocabIndex].word)}
                                className="flex items-center justify-center gap-2 py-3.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-2xl shadow-sm font-bold text-sm transition-all transform active:scale-95 cursor-pointer border border-stone-300"
                            >
                                <Volume2 className="w-5 h-5 text-stone-700" />
                                <span>Pronounce</span>
                            </button>

                            <button
                                onClick={handleNextVocab}
                                className="flex items-center justify-center gap-2 py-3.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-2xl shadow-sm font-bold text-sm transition-all transform active:scale-95 cursor-pointer border border-stone-300"
                            >
                                <span>Next</span>
                                <ArrowRight className="w-5 h-5 text-stone-700" />
                            </button>
                        </div>

                        {/* Previous Button Placed Below Next Button */}
                        <div className="w-full">
                            <button
                                onClick={handlePrevVocab}
                                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold text-xs transition-all cursor-pointer border border-stone-200"
                            >
                                ← Previous Item
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* VIEW 3: COMPLETION / CONGRATULATIONS SCREEN */}
            {currentView === 'completion' && (
                <div className="relative z-10 w-full max-w-md px-5 pt-2 pb-8 flex flex-col items-center">
                    <div className="w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl border-4 border-white/90 p-6 mt-2 flex flex-col items-center text-center">

                        {/* Celebration Icon */}
                        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                            <PartyPopper className="w-16 h-16 text-amber-600 animate-pulse" />
                            <div className="absolute inset-0 bg-linear-to-tr from-amber-400/20 to-orange-400/20 pointer-events-none"></div>
                        </div>

                        <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-6">
                            Level Complete!
                        </h1>

                        {/* Responsive Progress Row */}
                        <div className="w-full bg-stone-100 rounded-2xl p-4 flex items-center justify-between mb-8 border border-stone-200 shadow-inner">
                            <span className="font-bold text-stone-700 text-base">Progress</span>
                            <span className="font-black text-stone-900 text-lg bg-white px-4 py-1 rounded-xl shadow-sm border border-stone-200">
                                {responsiveProgressText}
                            </span>
                        </div>

                        <p className="text-stone-700 font-extrabold text-base mb-8">
                            You did great, Keep it Up!!
                        </p>

                        {/* Purple Continue Button */}
                        <button
                            onClick={handleCompleteFinish}
                            className="w-full py-4 bg-[#6900f2] hover:bg-[#5800cc] text-white font-black text-lg rounded-2xl shadow-xl transition-all transform active:scale-95 cursor-pointer tracking-wider"
                        >
                            CONTINUE
                        </button>

                    </div>
                </div>
            )}

            {/* THEMED ALERT MODAL FOR LOCKED LESSONS & NOTIFICATIONS */}
            {showAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border-4 border-orange-200 text-center relative overflow-hidden">

                        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-orange-400 to-amber-400"></div>

                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner mb-4 mt-2">
                            <Lock className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-black text-stone-900 mb-2">Notice</h3>
                        <p className="text-stone-600 text-sm mb-6 leading-relaxed font-semibold">
                            {alertMessage}
                        </p>

                        <button
                            onClick={() => setShowAlert(false)}
                            className="w-full py-3 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-md transition-all transform active:scale-95 cursor-pointer"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}