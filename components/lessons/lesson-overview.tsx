"use client";

import React, { useState } from 'react';
import {
    BookOpen, Lock, ArrowLeft, Sparkles,
    Volume2, ArrowRight, PartyPopper,
} from 'lucide-react';

interface Lesson {
    id: number;
    title: string;
    level: string;
    unlocked: boolean;
    progressCount: number;
    maxProgress: number;
}

interface VocabItem {
    word: string;
    meaning: string;
    emoji: string;
    levelText: string;
}

export default function LessonOverview() {
    const [currentView, setCurrentView] = useState<'lessons' | 'detail' | 'completion'>('lessons');
    const [activeLessonId, setActiveLessonId] = useState<number>(1);
    const [vocabIndex, setVocabIndex] = useState<number>(0);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const [lessons, setLessons] = useState<Lesson[]>([
        { id: 1, title: 'Lesson 1', level: 'Level 1/10', unlocked: true, progressCount: 1, maxProgress: 10 },
        { id: 2, title: 'Lesson 2', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
        { id: 3, title: 'Lesson 3', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
        { id: 4, title: 'Lesson 4', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
        { id: 5, title: 'Lesson 5', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
        { id: 6, title: 'Lesson 6', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
        { id: 7, title: 'Lesson 7', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
        { id: 8, title: 'Lesson 8', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
        { id: 9, title: 'Lesson 9', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
        { id: 10, title: 'Lesson 10', level: 'Level 0/10', unlocked: false, progressCount: 0, maxProgress: 10 },
    ]);

    const vocabItems: VocabItem[] = [
        { word: 'apple', meaning: 'A round fruit that grows on trees.', emoji: '🍎', levelText: 'Level 1-1' },
        { word: 'banana', meaning: 'A long curved yellow fruit with a sweet taste.', emoji: '🍌', levelText: 'Level 1-2' },
        { word: 'carrot', meaning: 'A crunchy orange root vegetable packed with vitamins.', emoji: '🥕', levelText: 'Level 1-3' },
    ];

    const handleLessonClick = (lesson: Lesson): void => {
        if (lesson.unlocked) {
            setActiveLessonId(lesson.id);
            setVocabIndex(0);
            setCurrentView('detail');
        } else {
            setAlertMessage('Finished the current lesson to unlock');
            setShowAlert(true);
        }
    };

    const handlePronounce = (word: string): void => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleNextVocab = (): void => {
        if (vocabIndex < vocabItems.length - 1) {
            setVocabIndex(vocabIndex + 1);
        } else {
            setCurrentView('completion');
        }
    };

    const handlePrevVocab = (): void => {
        if (vocabIndex > 0) {
            setVocabIndex(vocabIndex - 1);
        } else {
            setCurrentView('lessons');
        }
    };

    const handleCompleteFinish = (): void => {
        setLessons(prevLessons =>
            prevLessons.map(l => {
                if (l.id === activeLessonId) {
                    const newProg = Math.min(l.progressCount + 1, l.maxProgress);
                    return { ...l, progressCount: newProg, level: `Level ${newProg}/${l.maxProgress}` };
                }
                if (l.id === activeLessonId + 1) {
                    return { ...l, unlocked: true, level: 'Level 1/10', progressCount: 1 };
                }
                return l;
            })
        );
        setCurrentView('lessons');
    };

    const completedLessonsCount = lessons.filter(l => l.progressCount > 0 && l.id <= activeLessonId).length;
    const responsiveProgressText = `${Math.max(completedLessonsCount, activeLessonId)}/10`;

    return (
        <div className="relative flex w-full flex-col items-center pb-6 font-sans">



            {/* Top Header Navigation Bar */}
            <div className="relative z-10 w-full max-w-md px-6 pt-6 pb-2 flex items-center justify-between">
                <button
                    onClick={() => {
                        if (currentView === 'lessons') {
                            setAlertMessage('You are already on the main page.');
                            setShowAlert(true);
                        } else {
                            setCurrentView('lessons');
                        }
                    }}
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

            {/* VIEW 2: LESSON ITEM DETAIL VIEW */}
            {currentView === 'detail' && (
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
                        <div className="w-full h-[2px] bg-stone-300 mb-5"></div>

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
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 pointer-events-none"></div>
                        </div>

                        <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-6">
                            Congratulations!!!!
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

                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-amber-400"></div>

                        <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner mb-4 mt-2">
                            <Lock className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-black text-stone-900 mb-2">Notice</h3>
                        <p className="text-stone-600 text-sm mb-6 leading-relaxed font-semibold">
                            {alertMessage}
                        </p>

                        <button
                            onClick={() => setShowAlert(false)}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-md transition-all transform active:scale-95 cursor-pointer"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}