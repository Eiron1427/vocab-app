import Link from "next/link";
import { Settings } from "lucide-react";

export default function GameHeader() {
    return (
        <header className="flex justify-end">
            <Link href="/settings" aria-label="Settings"
                className="grid size-11 place-items-center rounded-xl bg-white text-black hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                <Settings className="size-6" aria-hidden="true" />
            </Link>
        </header>
    );
}
