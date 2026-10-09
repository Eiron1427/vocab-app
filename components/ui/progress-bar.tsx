type ProgressBarProps = {
    value: number;
    label: string;
};

export default function ProgressBar({ value, label }: ProgressBarProps) {
    const percentage = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

    return (
        <progress
            aria-label={label}
            value={percentage}
            max={100}
            className="block h-4.5 w-full overflow-hidden rounded-full border-0 bg-[#ffb98a]/80 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-[#ffb98a]/80 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#ffa500] [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-[#ffa500]"
        />
    );
}
