import { ZxcvbnFactory } from "@zxcvbn-ts/core";
import * as common from "@zxcvbn-ts/language-common";
import * as english from "@zxcvbn-ts/language-en";

export class PasswordStrengthService {
    private readonly estimator = new ZxcvbnFactory({
        translations: english.translations,
        graphs: common.adjacencyGraphs,
        dictionary: {
            ...common.dictionary,
            ...english.dictionary,
        },
    });

    evaluate(password: string) {
        const result = this.estimator.check(password);

        return {
            score: result.score,
            warning: result.feedback.warning,
            suggestions: result.feedback.suggestions,
        };
    }
}