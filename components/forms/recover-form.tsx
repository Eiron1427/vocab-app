"use client";

import { useState, useEffect, type FormEvent } from "react";
import { AuthValidator } from '@/validators/auth-validator';
import PasswordStrength from './password-strength'
import { useRouter } from "next/navigation";
import Link from "next/link";


const authValidator = new AuthValidator();

type Step = "email" | "code" | "password" | "done";

function EnvelopeIcon() {
    return (
        <svg
            className="h-5 w-5 text-gray-800 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            className="h-5 w-5 text-gray-800 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
        >
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function KeyIcon() {
    return (
        <svg
            className="h-5 w-5 text-gray-800 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
        >
            <circle cx="8" cy="14" r="4" />
            <path d="M11 11l8-8M16 5l2 2M19 2l3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function RecoveryForm() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const [previewCode, setPreviewCode] = useState("");

    useEffect(() => {
        if (step !== "done") return;

        const timer = window.setTimeout(() => {
            router.replace("/login");
        }, 2000);

        return () => window.clearTimeout(timer);
    }, [step, router]);

    function createPreviewCode() {
        const values = new Uint32Array(1);
        crypto.getRandomValues(values);

        setPreviewCode(
            String(100000 + (values[0] % 900000))
        );

        setCode("");
        setError(null);
    }

    function changeEmail() {
        setCode("");
        setPreviewCode("");
        setPassword("");
        setConfirm("");
        setError(null);
        setStep("email");
    }

    function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const normalizedEmail = email.trim();
        const result = authValidator.validateEmail(normalizedEmail);

        if (!result.valid) {
            setError(result.error);
            return;
        }

        setEmail(normalizedEmail);
        createPreviewCode();
        setStep("code");
    }

    function handleCodeSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (!/^\d{6}$/.test(code) || code !== previewCode) {
            setError("The code does not match. Please try again.");
            return;
        }

        setPreviewCode("");
        setCode("");
        setStep("password");
    }

    function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const result = authValidator.validatePassword({
            password,
            confirmPassword: confirm,
        });

        if (!result.valid) {
            setError(result.error);
            return;
        }

        setPassword("");
        setConfirm("");
        setStep("done");
    }

    const fieldWrapClass =
        "flex items-center gap-3 w-full h-14 rounded-xl border-2 border-gray-900 bg-[#ffddb0] px-4";
    const fieldInputClass =
        "flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-600 font-medium";
    const primaryBtnClass =
        "flex items-center justify-center w-full h-14 cursor-pointer rounded-xl border-2 border-gray-900 bg-[#ffe183] px-4 text-xl font-extrabold text-[#111] transition-colors hover:bg-[#ffd45a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176c98] disabled:opacity-60 disabled:cursor-not-allowed";

    return (
        <div
            className="min-h-15.5 flex items-center justify-center p-4 bg-cover bg-bottom bg-no-repeat"
            style={{ backgroundImage: "url('/recovery-bg.png')" }}
        >
            <div className="w-full max-w-sm bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8">

                {error && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm px-3 py-2"
                    >
                        {error}
                    </div>
                )}

                {step === "email" && (
                    <>
                        <p className="mb-6 text-gray-800">
                            Enter the email address associated with your account
                            to start recovery.
                        </p>
                        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
                            <div className={fieldWrapClass}>
                                <EnvelopeIcon />
                                <input
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className={fieldInputClass}
                                />
                            </div>
                            <button type="submit" className={primaryBtnClass}>
                                CONTINUE
                            </button>
                        </form>
                    </>
                )}

                {step !== "done" && (
                    <p className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="rounded text-sm font-medium text-blue-700 underline"
                        >
                            Back to login
                        </Link>
                    </p>
                )}

                {step === "code" && (
                    <>
                        <p className="mb-4 text-gray-800">
                            Recovery email:{" "}
                            <span className="break-all font-semibold">{email}</span>
                        </p>

                        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                            <p>
                                Email delivery is not connected yet. Use this code
                                to try the recovery flow:
                            </p>
                            <p className="mt-2 text-center text-2xl font-bold tracking-widest">
                                {previewCode}
                            </p>
                        </div>

                        <form onSubmit={handleCodeSubmit} className="flex flex-col gap-5">
                            <div className={fieldWrapClass}>
                                <KeyIcon />
                                <input
                                    type="text"
                                    required
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Enter code"
                                    className={`${fieldInputClass} tracking-[0.4em] text-center`}
                                    aria-label="Recovery code"
                                    minLength={6}
                                    pattern="[0-9]{6}"
                                />
                            </div>
                            <button type="submit" className={primaryBtnClass}>
                                VERIFY CODE
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-xl font-bold">OR</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
                            <button
                                type="button"
                                onClick={changeEmail}
                                className="rounded px-2 py-2 font-medium text-blue-700 underline"
                            >
                                Change email
                            </button>

                            <button
                                type="button"
                                onClick={createPreviewCode}
                                className="rounded px-2 py-2 font-medium text-blue-700 underline"
                            >
                                Generate another code
                            </button>
                        </div>
                    </>
                )}

                {step === "password" && (
                    <>
                        <p className="mb-6 text-gray-800">
                            Enter and confirm a new password.
                        </p>
                        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                            <div className={fieldWrapClass}>
                                <LockIcon />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className={fieldInputClass}
                                    aria-describedby="recovery-password-hint"
                                    minLength={8}
                                    autoComplete="new-password"
                                    aria-label="New password"
                                />

                            </div>
                            <PasswordStrength
                                id="recovery-password-hint"
                                password={password}
                            />
                            <div className={fieldWrapClass}>
                                <LockIcon />
                                <input
                                    type="password"
                                    required
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Confirm new password"
                                    className={fieldInputClass}
                                    minLength={8}
                                    autoComplete="new-password"
                                    aria-label="Confirm new password"
                                />

                            </div>
                            <button type="submit" className={primaryBtnClass}>
                                CONTINUE
                            </button>
                        </form>
                    </>
                )}

                {step === "done" && (
                    <div className="pt-2 text-center">
                        <div
                            role="status"
                            aria-live="polite"
                            className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
                        >
                            <p className="font-semibold">
                                Password checks passed.
                            </p>
                            <p className="mt-2 text-sm">
                                No account password was changed. Opening login…
                            </p>
                        </div>

                        <Link
                            href="/login"
                            className={`${primaryBtnClass} mt-5`}
                        >
                            BACK TO LOGIN
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}