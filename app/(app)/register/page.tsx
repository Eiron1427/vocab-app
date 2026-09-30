import RegisterForm from "@/components/forms/register-form";

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
                    Create an account
                </h2>

                <RegisterForm />
            </section>
        </>
    );
}