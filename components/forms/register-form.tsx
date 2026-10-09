"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { UserRound, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { inputStyle, fieldStyle, eyeButtonStyle } from "./form-styles"
import { useRouter } from "next/navigation"
import { AuthValidator } from '@/validators/auth-validator';
import PasswordStrength from './password-strength'
import { settingsService } from '@/lib/app-services'



const authValidator = new AuthValidator();

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!success) return;

        const timer = window.setTimeout(() => {
            router.replace("/login");
        }, 2000);

        return () => window.clearTimeout(timer);
    }, [success, router]);


    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (success) return;

        setError("");

        const result = authValidator.validateRegistration({
            username: username.trim(),
            email: email.trim(),
            password,
            confirmPassword,
        });

        if (!result.valid) {
            setError(result.error);
            return;
        }

        try {
            settingsService.saveProfile({
                username: username.trim(),
                email: email.trim(),
            });

            setPassword("");
            setConfirmPassword("");
            setShowPassword(false);
            setShowConfirmPassword(false);
            setSuccess(true);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Could not save your profile. Please try again."
            );
        }
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
                        <UserRound
                            aria-hidden="true"
                            className="size-7 shrink-0 text-[#292929]"
                        />

                        <label htmlFor="username" className="sr-only">
                            Username dito mo ilagay
                        </label>

                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username mo dito"
                            autoComplete="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                            className={inputStyle}
                            minLength={2}
                            maxLength={30}
                        />
                    </div>

                    <div className={fieldStyle}>
                        <Mail
                            aria-hidden="true"
                            className="size-7 shrink-0 text-[#292929]"
                        />

                        <label htmlFor="email" className="sr-only">
                            Dito ang Email address
                        </label>

                        <input
                            id="email"
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

                        <label htmlFor="password" className="sr-only">
                            Ilagay mo dito Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password mo dito"
                            autoComplete="new-password"
                            aria-describedby="password-hint"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            minLength={8}
                            required
                            className={inputStyle}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-controls="password"
                            className={eyeButtonStyle}
                        >
                            {showPassword ? (
                                <EyeOff aria-hidden="true" className="size-7" />
                            ) : (
                                <Eye aria-hidden="true" className="size-7" />
                            )}
                        </button>
                    </div>

                    <div className={fieldStyle}>
                        <LockKeyhole
                            aria-hidden="true"
                            className="size-7 shrink-0 text-[#292929]"
                        />

                        <label htmlFor="confirmPassword" className="sr-only">
                            Confirm mo password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm mo password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            minLength={8}
                            required
                            className={inputStyle}
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={
                                showConfirmPassword
                                    ? "Hide confirmation password"
                                    : "Show confirmation password"
                            }
                            aria-controls="confirmPassword"
                            className={eyeButtonStyle}
                        >
                            {showConfirmPassword ? (
                                <EyeOff aria-hidden="true" className="size-7" />
                            ) : (
                                <Eye aria-hidden="true" className="size-7" />
                            )}
                        </button>
                    </div>
                </div>

                <PasswordStrength id="password-hint" password={password} />

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
                        <p className="font-semibold">
                            Profile saved. Continue to login.
                        </p>
                        <p className="mt-1">
                            Opening login…
                        </p>
                    </div>
                )}

                <button
                    type="submit"

                    className="mt-8 min-h-15.5 w-full cursor-pointer rounded-[18px] border border-[#514b3e] bg-[#ffe183] p-3.5 text-xl font-extrabold text-[#111] transition-colors hover:bg-[#ffd45a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176c98]"

                >

                    {success ? "Opening login…" : "CREATE ACCOUNT"}

                </button>
            </fieldset>

            <div className="mb-4 mt-6 flex items-center gap-5">
                <span className="h-px flex-1 bg-[#514b3e]" />
                <span className="text-xl font-bold">OR</span>
                <span className="h-px flex-1 bg-[#514b3e]" />
            </div>

            <p className="text-center text-base">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="rounded-sm text-[#173caf] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176c98]"
                >
                    Login
                </Link>
            </p>
        </form>
    );
}