"use client";
import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Volume2, UserRound, Info, PenLine, Check, } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { settingsService, speechService } from "@/lib/app-services";
import type { ProfileSettings } from "@/types/app-state";
import { panelStyle, fieldStyle, primaryStyle, secondaryStyle } from "@/components/ui/app-styles";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const sections = [
    { id: "notifications", title: "Notifications", icon: Bell },
    { id: "volume", title: "Volume", icon: Volume2 },
    { id: "account", title: "Account", icon: UserRound },
    { id: "about", title: "About", icon: Info },
] as const;
type Section = (typeof sections)[number]["id"];

function AccountForm({
    profile,
    onSave,
}: {
    profile: ProfileSettings;
    onSave: (profile: ProfileSettings) => void;
}) {
    const [username, setUsername] = useState(profile.username);
    const [email, setEmail] = useState(profile.email);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSave({ username, email });
    }
    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label htmlFor="settings-name" className="font-semibold">
                    Display name
                </label>
                <input
                    id="settings-name"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    minLength={2}
                    maxLength={30}
                    required
                    autoComplete="nickname"
                    className={fieldStyle}
                />
            </div>
            <div>
                <label htmlFor="settings-email" className="font-semibold">
                    Email <span className="font-normal text-stone-600">(optional)</span>
                </label>
                <input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    aria-describedby="account-note"
                    placeholder="name@example.com"
                    className={fieldStyle}
                />
            </div>
            <p id="account-note" className="text-sm text-stone-600">
                Your profile details are saved on this device.
            </p>
            <button type="submit" className={`${primaryStyle} w-full`}>
                Save profile
            </button>
        </form>
    );
}
function VolumeForm({
    initial,
    onSave,
    onError,
}: {
    initial: number;
    onSave: (volume: number) => void;
    onError: (message: string) => void;
}) {
    const [volume, setVolume] = useState(initial);
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <label htmlFor="pronunciation-volume" className="font-semibold">
                    Pronunciation volume
                </label>
                <output
                    htmlFor="pronunciation-volume"
                    className="rounded-full bg-orange-100 px-3 py-1 font-bold"
                >
                    {volume}%
                </output>
            </div>
            <input
                id="pronunciation-volume"
                type="range"
                min={0}
                max={100}
                step={5}
                value={volume}
                aria-valuetext={volume === 0 ? "Muted" : `${volume} percent`}
                onChange={(event) => {
                    speechService.stop();
                    setVolume(Number(event.target.value));
                }}
                className="h-8 w-full cursor-pointer accent-orange-500"
            />
            <p className="text-sm text-stone-600">
                Controls spoken words in lessons. Device volume and installed voices
                also affect playback. Zero mutes pronunciation.
            </p>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    className={secondaryStyle}
                    onClick={() => {
                        try {
                            speechService.speak(
                                "Welcome to your vocabulary adventure",
                                volume,
                                onError,
                            );
                        } catch (error) {
                            onError((error as Error).message);
                        }
                    }}
                >
                    <Volume2 size={18} aria-hidden="true" />
                    Test sound
                </button>
                <button
                    type="button"
                    className={primaryStyle}
                    onClick={() => onSave(volume)}
                >
                    Save volume
                </button>
            </div>
        </div>
    );
}

export default function SettingsOverview() {
    const { state, ready } = useAppState();
    useEffect(() => () => speechService.stop(), []);
    const [section, setSection] = useState<Section>("notifications");
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");
    function save(action: () => void, message: string) {
        setError("");
        setNotice("");
        try {
            action();
            setNotice(message);
        } catch (error) {
            setError((error as Error).message);
        }
    }
    function choose(next: Section) {
        speechService.stop();
        setSection(next);
        setError("");
        setNotice("");
    }

    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        if (!loggingOut) return;

        const timer = window.setTimeout(() => {
            router.replace("/login");
        }, 1500);

        return () => window.clearTimeout(timer);
    }, [loggingOut, router]);

    function handleLogout() {
        if (loggingOut) return;

        speechService.stop();
        setError("");
        setNotice("");
        setLoggingOut(true);
    }

    return (
        <section aria-labelledby="settings-heading" className={panelStyle}>
            <Link
                href="/profile"
                onClick={() => speechService.stop()}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-stone-700 focus-visible:outline-2"
            >
                <ArrowLeft size={18} aria-hidden="true" />
                Return to profile
            </Link>
            <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-700">
                    Make it yours
                </p>
                <h1 id="settings-heading" className="mt-1 text-3xl font-extrabold">
                    Settings
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    Your learning preferences, saved on this device.
                </p>
            </div>
            <nav
                aria-label="Settings sections"
                className="my-6 grid grid-cols-2 gap-2"
            >
                {sections.map(({ id, title, icon: Icon }) => (
                    <button
                        type="button"
                        key={id}
                        aria-pressed={section === id}
                        onClick={() => choose(id)}
                        className={`flex min-h-12 items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-purple-700 ${section === id ? "border-amber-400 bg-[#ffe183] text-stone-900" : "border-stone-200 bg-white text-stone-600 hover:bg-orange-50"}`}
                    >
                        <Icon size={19} aria-hidden="true" />
                        {title}
                    </button>
                ))}
            </nav>
            {error && (
                <p
                    role="alert"
                    className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800"
                >
                    {error}
                </p>
            )}
            {notice && (
                <p
                    role="status"
                    className="mb-4 flex gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-800"
                >
                    <Check size={18} aria-hidden="true" />
                    {notice}
                </p>
            )}
            {!ready ? (
                <p role="status">Loading your preferences…</p>
            ) : (
                <>
                    <h2 className="mb-4 text-xl font-bold">
                        {sections.find((item) => item.id === section)?.title}
                    </h2>
                    {section === "notifications" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4 rounded-2xl bg-orange-50 p-4">
                                <div>
                                    <p id="notification-label" className="font-semibold">
                                        In-app notices
                                    </p>
                                    <p
                                        id="notification-help"
                                        className="mt-1 text-sm text-stone-600"
                                    >
                                        Show optional notices while using the app.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={state.notifications}
                                    aria-labelledby="notification-label"
                                    aria-describedby="notification-help"
                                    onClick={() => {
                                        save(
                                            () =>
                                                settingsService.setNotifications(!state.notifications),
                                            "Notification preference saved.",
                                        );
                                    }}
                                    className={`relative h-11 w-16 shrink-0 rounded-full border-2 border-stone-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 ${state.notifications ? "bg-[#ffe183]" : "bg-stone-200"}`}
                                >
                                    <span
                                        className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition-transform ${state.notifications ? "left-0 translate-x-6" : "left-0 translate-x-1"}`}
                                    />
                                </button>
                            </div>
                            <p className="text-sm text-stone-600">
                                Controls optional encouragement after submitting a question.
                                Form errors and save confirmations always remain visible.
                            </p>
                        </div>
                    )}
                    {section === "volume" && (
                        <VolumeForm
                            key={state.volume}
                            initial={state.volume}
                            onSave={(value) =>
                                save(
                                    () => settingsService.setVolume(value),
                                    "Pronunciation volume saved.",
                                )
                            }
                            onError={setError}
                        />
                    )}
                    {section === "account" && (
                        <>
                            <AccountForm
                                key={`${state.profile.username}|${state.profile.email}`}
                                profile={state.profile}
                                onSave={(profile) =>
                                    save(
                                        () => settingsService.saveProfile(profile),
                                        "Profile saved on this device.",
                                    )
                                }
                            />
                            <div className="mt-6 border-t border-stone-200 pt-5">
                                <div className="flex items-center gap-2 font-bold">
                                    <PenLine size={20} aria-hidden="true" />
                                    Author access
                                </div>
                                <p className="mt-2 text-sm text-stone-600">
                                    Share a vocabulary question in Author Studio.
                                </p>
                                <Link
                                    href="/author-studio"
                                    className={`${primaryStyle} mt-4 w-full`}
                                >
                                    <PenLine size={18} aria-hidden="true" />
                                    Open Author Studio
                                </Link>
                            </div>

                            <div className="mt-6 border-t border-stone-200 pt-5">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-5 py-3 font-bold text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-60"
                                >
                                    <LogOut size={20} aria-hidden="true" />
                                    {loggingOut ? "Logging out…" : "Log out"}
                                </button>

                                {loggingOut && (
                                    <p
                                        role="status"
                                        aria-live="polite"
                                        className="mt-3 rounded-xl bg-purple-50 p-3 text-center text-sm text-purple-900"
                                    >
                                        Logging out… Returning to login.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                    {section === "about" && (
                        <div className="space-y-4 text-stone-700">
                            <p>
                                Build your English vocabulary through illustrated lessons,
                                spoken words, and short learning activities.
                            </p>
                            <div className="rounded-2xl bg-orange-50 p-4">
                                <p className="font-bold">Learn. Practice. Share.</p>
                                <p className="mt-2 text-sm">
                                    Author Studio lets you draft and preview questions to
                                    contribute to future learning content.
                                </p>
                            </div>
                            <p className="text-sm">
                                Preferences, lesson progress, and contributions are stored only
                                in this browser. Clearing browser data removes them.
                            </p>
                            <p className="font-semibold text-purple-700">Enjoy learning!</p>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

