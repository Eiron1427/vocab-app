import ForgotPasswordForm from "@/components/forms/forgot-pass";

export default function ForgotPasswordPage() {
    return (
        <section
            aria-labelledby="forgot-password-heading"
            className="rounded-[28px] bg-white/50 px-5 py-10 sm:px-7"
        >
            <h1
                id="forgot-password-heading"
                className="text-center text-5xl font-extrabold leading-tight sm:text-4xl"
            >
                Forgot Password
            </h1>

            <p className="mb-10 mt-2 text-center text-lg">
                Change your password
            </p>

            <ForgotPasswordForm />
        </section>
    );
}