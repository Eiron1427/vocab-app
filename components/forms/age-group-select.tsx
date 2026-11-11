import { AGE_GROUPS, isAgeGroup, type AgeGroup } from "@/types/age-group";

export default function AgeGroupSelect({ id, value, onChange, className }: {
    id: string;
    value?: AgeGroup;
    onChange: (ageGroup: AgeGroup | undefined) => void;
    className: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-1 block font-semibold">Learner age group</label>
            <select
                id={id}
                className={className}
                value={value ?? ""}
                onChange={({ target }) => onChange(isAgeGroup(target.value) ? target.value : undefined)}
                required
            >
                <option value="" disabled>Select your age group</option>
                {AGE_GROUPS.map((group) => <option key={group} value={group}>Ages {group}</option>)}
            </select>
        </div>
    );
}
