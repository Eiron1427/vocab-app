"use client";

import { useState, FormEvent } from "react";
import { AuthValidator } from '@/validators/auth-validator';
import PasswordStrength from './password-strength'


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

function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}

export default function RecoveryForm() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleEmailSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        const normalizedEmail = email.trim();
        const result =
            authValidator.validateEmail(normalizedEmail);

        if (!result.valid) {
            setError(result.error);
            return;
        }

        setEmail(normalizedEmail);
        setLoading(true);

        try {
            // Existing simulation; no email is actually sent.
            await new Promise((resolve) =>
                setTimeout(resolve, 700)
            );

            setCode("");
            setStep("code");
        } catch {
            setError(
                "We couldn't send the code. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    async function handleCodeSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 700));
            if (code.length !== 6) throw new Error("invalid");
            setStep("password");
        } catch {
            setError("That code didn't match. Check your inbox and try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handlePasswordSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        if (password.length < 8) {
            setError("Use at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords don't match.");
            return;
        }
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 700));
            setStep("done");
        } catch {
            setError("We couldn't reset your password. Try again.");
        } finally {
            setLoading(false);
        }
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
                        <p className="text-gray-800 mb-6">
                            Recover your account by entering the email you used to login
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
                            <button type="submit" className={primaryBtnClass} disabled={loading}>
                                {loading ? "SENDING..." : "SEND RECOVERY EMAIL"}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-xl font-bold">OR</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        <p className="text-center text-sm text-gray-900">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-700 underline font-medium">
                                Login
                            </a>
                        </p>
                    </>
                )}

                {step === "code" && (
                    <>
                        <p className="text-gray-800 mb-6">
                            Enter the 6-digit recovery code sent to{" "}
                            <span className="font-semibold">{email}</span>
                        </p>
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
                                />
                            </div>
                            <button type="submit" className={primaryBtnClass} disabled={loading}>
                                {loading ? "VERIFYING..." : "VERIFY CODE"}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-xl font-bold">OR</span>
                            <div className="flex-1 h-px bg-gray-300" />
                        </div>

                        <p className="text-center text-sm text-gray-900">
                            Wrong email?{" "}
                            <button
                                onClick={() => setStep("email")}
                                className="text-blue-700 underline font-medium"
                            >
                                Go back
                            </button>
                        </p>
                    </>
                )}

                {step === "password" && (
                    <>
                        <p className="text-gray-800 mb-6">
                            Recover your account by setting a new password
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
                                />

                            </div>
                            <PasswordStrength id="password-hint" password={password} />
                            <div className={fieldWrapClass}>
                                <LockIcon />
                                <input
                                    type="password"
                                    required
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Confirm new password"
                                    className={fieldInputClass}
                                />

                            </div>
                            <button type="submit" className={primaryBtnClass} disabled={loading}>
                                {loading ? "RECOVERING..." : "RECOVER ACCOUNT"}
                            </button>
                        </form>
                    </>
                )}

                {step === "done" && (
                    <div className="flex flex-col items-center text-center pt-2">
                        <div className="rounded-full bg-green-200 border-2 border-gray-900 text-green-800 p-3 mb-4">
                            <CheckIcon />
                        </div>
                        <p className="text-gray-800 mb-6">
                            Your account has been recovered. You can now sign in with your new password.
                        </p>
                        <a href="/login" className={`${primaryBtnClass} text-center block`}>
                            BACK TO SIGN IN
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}