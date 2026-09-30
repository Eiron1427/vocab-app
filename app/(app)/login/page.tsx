import LoginForm from "@/components/forms/login-form";

export default function LoginPage() {
    return (
        <>
            <h1 className="mb-5 text-center text-5xl font-extrabold leading-tight sm:text-6xl">
                Log in
            </h1>

            <section
                aria-labelledby="login-heading"
                className="rounded-[28px] bg-white/50 px-5 py-7"
            >
                <h2
                    id="login-heading"
                    className="mb-7 text-center text-3xl font-bold"
                >
                    Welcome back!
                </h2>

                <LoginForm />
            </section>
        </>
    );
}