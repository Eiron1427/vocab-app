"use client";
import Link from "next/link";
import { useProfile } from "@/hooks/use-profile";
import ProgressBar from "@/components/ui/progress-bar";
import ProfileAvatar from "@/components/profile/profile-avatar";
import { BookOpen, ListChecks, Target, Languages, Layers } from "lucide-react";
import type { ProfileMetric } from "@/types/profile";
const icons: Record<ProfileMetric, typeof BookOpen> = {
    lessons: BookOpen,
    levels: Layers,
    quizzes: ListChecks,
    score: Target,
    words: Languages,
};
export default function ProfileOverview() {
    const { profile, ready } = useProfile();
    if (!ready)
        return (
            <p role="status" className="rounded-[26px] bg-white/80 p-5">
                Loading your progress…
            </p>
        );
    return (
        <section className="rounded-[26px] bg-white/55 p-4 text-black backdrop-blur-sm sm:p-5">
            <div className="mt-2 flex items-center gap-4">
                <ProfileAvatar />
                <div className="min-w-0 flex-1">
                    <h1 className="wrap-break-word text-3xl font-bold leading-tight sm:text-4xl">
                        {profile.displayName}
                    </h1>
                    <p className="mt-3 text-xs text-neutral-700">
                        Available learning content completed
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                            <ProgressBar
                                value={profile.levelProgress}
                                label="Available learning content completed"
                            />
                        </div>
                        <span className="text-xs text-neutral-700">
                            {profile.levelProgress}%
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 min-[380px]:grid-cols-4">
                {profile.stats.map(({ metric, value, label }) => {
                    const Icon = icons[metric];
                    return (
                        <div
                            key={metric}
                            className="flex flex-col items-center rounded-2xl bg-white px-2 py-3 shadow-md"
                        >
                            <Icon className="size-8" strokeWidth={1.8} aria-hidden="true" />
                            <span className="mt-1 text-lg font-bold leading-tight">
                                {value}
                            </span>
                            <span className="mt-1 whitespace-pre-line text-center text-xs leading-tight">
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 space-y-3 rounded-2xl bg-white p-3 shadow-md">
                {profile.progress.map(({ metric, label, pct, right }) => {
                    const Icon = icons[metric];
                    return (
                        <div key={metric} className="flex items-center gap-2">
                            <Icon
                                className="size-7 shrink-0"
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="mb-1 text-xs">{label}</p>
                                <ProgressBar value={pct} label={label} />
                            </div>
                            <span className="min-w-12 text-right text-xs">{right}</span>
                        </div>
                    );
                })}
                <p className="text-xs text-neutral-600">
                    Average uses the latest completed score for each quiz with a saved
                    result. An unfinished retry does not replace it.
                </p>
                {profile.completedQuizzes > profile.scoredQuizzes && (
                    <p className="text-xs text-amber-800">
                        Some earlier completions have no saved score. Retake those quizzes
                        to record a result.
                    </p>
                )}
            </div>
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-md">
                <h2 className="text-lg font-bold">Learning summary</h2>
                {!profile.summary.length ? (
                    <div className="mt-3 text-sm text-neutral-700">
                        <p>
                            Complete a lesson level or answer a quiz question to see your
                            progress here.
                        </p>
                        <Link
                            href="/lessons"
                            className="mt-3 inline-block rounded-xl bg-purple-700 px-4 py-3 font-bold text-white"
                        >
                            Start learning
                        </Link>
                    </div>
                ) : (
                    <ul className="mt-3 space-y-3">
                        {profile.summary.map((item) => {
                            const Icon = item.kind === "lesson" ? BookOpen : ListChecks;
                            return (
                                <li key={item.id}>
                                    <Link
                                        href={item.href}
                                        className="flex min-h-14 items-center gap-3 rounded-xl bg-orange-50 p-3 focus-visible:outline-2 focus-visible:outline-purple-700"
                                    >
                                        <Icon className="size-7 shrink-0" aria-hidden="true" />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-bold">
                                                {item.title}
                                            </span>
                                            <span className="block text-xs text-neutral-700">
                                                {item.detail}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>
    );
}