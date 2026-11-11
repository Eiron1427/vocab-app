import type { Contribution } from "@/types/app-state";
import { QuestionModel } from "@/models/question";

export class CommunityQuizModel {
    static approved(contributions: readonly Contribution[]) {
        return contributions.filter(
            (item) => item.status === "approved" && new QuestionModel(item).validate() === null,
        );
    }

    static matches(answer: string, expected: string) {
        const normalize = (value: string) =>
            value.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
        const entered = normalize(answer);
        return entered.length > 0 && entered === normalize(expected);
    }
}
