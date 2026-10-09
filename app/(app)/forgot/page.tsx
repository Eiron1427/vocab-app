<<<<<<< HEAD
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
=======
import ForgotPass from "@/components/forms/forgot-pass";

export default function RegisterPage() {
    return (
        <>
            <h1 className="mb-5 text-center text-5xl font-extrabold leading-tight sm:text-6xl">
                Sign up
            </h1>

            <section
                aria-labelledby="signup-heading"
                className="rounded-[28px] bg-white/50 px-5 py-7"
            >
                <h2
                    id="signup-heading"
                    className="mb-7 text-center text-3xl font-bold"
                >
                    Change Password
                </h2>

            </section>
        </>
>>>>>>> 2e5d4f00a20ce2d02a367e5345e7c9cac7566892
    );
}