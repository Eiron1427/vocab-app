import RecoveryForm from "@/components/forms/recover-form";

export default function RecoveryPage() {
    return (
        <>

            <section
                aria-labelledby="login-heading"
                className="rounded-[28px] bg-white/50 px-5 py-7"
            >
                <h1 className="mb-5 text-center text-5xl font-extrabold leading-tight sm:text-6xl">
                    Recover Account
                </h1>

                <RecoveryForm />
            </section>
        </>
    );
}