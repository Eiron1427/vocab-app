"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

export default function ForgotPass() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setSuccess(false);

        if (password.length < 8) {
            setError("Password must have at least 8 characters.");
            return;
        }

        setSuccess(true);
        setPassword("");
        setShowPassword(false);
    }
}