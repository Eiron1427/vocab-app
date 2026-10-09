"use client";


import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation"
import { inputStyle, fieldStyle, eyeButtonStyle } from "./form-styles"
import { AuthValidator } from '@/validators/auth-validator';
const authValidator = new AuthValidator();

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!success) return;

        const timer = window.setTimeout(() => {
            router.replace("/profile");
        }, 1500);

        return () => window.clearTimeout(timer);
    }, [success, router]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (success)
            return;

        setError("");
        setSuccess(false);

        const result = authValidator.validateLogin({
            email: email.trim(), password,
        });

        if (!result.valid) {
            setError(result.error);
            return;
        }

        setSuccess(true);
    }


    return (
        <form
            onSubmit={handleSubmit}
            onChange={() => {
                if (!success) setError("");
            }}
        >
            <fieldset disabled={success} className="m-0 min-w-0 border-0 p-0">
                <div className="grid gap-6">
                    <div className={fieldStyle}>
                        <Mail
                            aria-hidden="true"
                            className="size-7 shrink-0 text-[#292929]"
                        />

                        <label htmlFor="login-email" className="sr-only">
                            Dito ang Email address
                        </label>

                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="Email address mo dito"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className={inputStyle}
                        />
                    </div>

                    <div className={fieldStyle}>
                        <LockKeyhole
                            aria-hidden="true"
                            className="size-7 shrink-0 text-[#292929]"
                        />

                        <label htmlFor="login-password" className="sr-only">
                            Ilagay mo dito Password
                        </label>

                        <input
                            id="login-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password mo dito"
                            autoComplete="current-password"
                            aria-describedby="login-password-hint"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            minLength={8}
                            required
                            className={inputStyle}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            aria-controls="login-password"
                            className={eyeButtonStyle}
                        >
                            {showPassword ? (
                                <EyeOff aria-hidden="true" className="size-7" />
                            ) : (
                                <Eye aria-hidden="true" className="size-7" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-right">
                    <Link
                        href="/forgot"
                        className="rounded-sm text-sm text-[#173caf] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176c98]"
                    >
                        Forgot password?
                    </Link>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"
                    >
                        {error}
                    </p>
                )}

                {success && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                    >
                        <p className="font-semibold">Welcome back!</p>
                        <p className="mt-1">Opening your profile…</p>
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-8 min-h-15.5 w-full cursor-pointer rounded-[18px] border border-[#514b3e] bg-[#ffe183] p-3.5 text-xl font-extrabold text-[#111] transition-colors hover:bg-[#ffd45a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176c98]"
                >
                    {success ? "Opening profile…" : "LOGIN"}
                </button>
            </fieldset>

            <div className="mb-4 mt-6 flex items-center gap-5">
                <span className="h-px flex-1 bg-[#514b3e]" />
                <span className="text-xl font-bold">OR</span>
                <span className="h-px flex-1 bg-[#514b3e]" />
            </div>

            <p className="text-center text-base">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="rounded-sm text-[#173caf] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176c98]"
                >
                    Sign up
                </Link>
            </p>

        </form>
    );
}