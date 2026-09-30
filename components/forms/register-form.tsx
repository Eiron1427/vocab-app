"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { UserRound, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setSuccess(false);

        if (!username.trim()) {
            setError("username ang ilagay");
            return;
        }

        if (password.length < 8) {
            setError("8 characters ang password.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Ulit, mali password mo");
            return;
        }

        setSuccess(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    const fieldStyle =
        "flex min-h-[60px] items-center gap-3 rounded-[18px] " +
        "border border-[#514b3e] bg-[#ffddb0] px-3.5 py-2 " +
        "focus-within:ring-2 focus-within:ring-[#176c98] " +
        "focus-within:ring-offset-2";

    const inputStyle =
        "w-full min-w-0 border-0 bg-transparent py-1.5 " +
        "text-base text-[#111] outline-none placeholder:text-[#34302b] " +
        "sm:text-xl";

    const eyeButtonStyle =
        "grid size-11 shrink-0 cursor-pointer place-items-center " +
        "rounded-lg text-[#292929] hover:bg-black/5 " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 " +
        "focus-visible:outline-[#176c98]";

    return (
        <form
            onSubmit={handleSubmit}
            onChange={() => {
                setError("");
                setSuccess(false);
            }}
        >
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

            <p id="password-hint" className="mt-3 text-sm">
                Dapat 8 characters ang Password mo
            </p>

            {error && (
                <p
                    role="alert"
                    className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"
                >
                    {error}
                </p>
            )}

            {success && (
                <p
                    role="status"
                    className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800"
                >
                    Okay na, naka gawa kana ng account, pero di na save(wala pa di pa pwede)
                </p>
            )}

            <button
                type="submit"
                className="mt-8 min-h-15.5 w-full cursor-pointer rounded-[18px] border border-[#514b3e] bg-[#ffe183] p-3.5 text-xl font-extrabold text-[#111] transition-colors hover:bg-[#ffd45a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176c98]"
            >
                CREATE ACCOUNT
            </button>

            <div className="mb-4 mt-6 flex items-center gap-5">
                <span className="h-px flex-1 bg-[#514b3e]" />
                <span className="text-xl">OR</span>
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