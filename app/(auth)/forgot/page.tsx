import RecoveryForm from "@/components/forms/recover-form";

export default function ForgotPasswordPage() {
    return (
        <section
            aria-labelledby="forgot-password-heading"
            className="rounded-[28px] bg-white/50 px-5 py-10 sm:px-7"
        >
            <h1
                id="forgot-password-heading"
                className="mb-6 text-center text-4xl font-extrabold leading-tight"
            >
                Forgot Password?
            </h1>

            <RecoveryForm />
        </section>
    );
}