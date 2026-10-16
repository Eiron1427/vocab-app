import type { LoginInput, PasswordInput, RegisterInput, ValidationResult } from "../types/auth";

export class AuthValidator {
    validateEmail(value: string): ValidationResult {
        const email = value.trim();

        const invalid: ValidationResult = {
            valid: false,
            error: "Enter a valid email address, such as name@example.com.",
        };

        if (email.length > 254) return invalid;

        const parts = email.split("@");
        if (parts.length !== 2) return invalid;

        const [local, domain] = parts;
        const labels = domain.split(".");

        const hasCountryLikeLabelBeforeEnd = labels
            .slice(0, -1)
            .some((label) => /^[A-Za-z]{2}$/.test(label));

        if (hasCountryLikeLabelBeforeEnd) {
            return {
                valid: false,
                error: "Use only one country Suffix at the end of the email domain.",
            };
        }

        const validLocal =
            local.length > 0 &&
            local.length <= 64 &&
            /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) &&
            !local.startsWith(".") &&
            !local.endsWith(".") &&
            !local.includes("..");

        const validDomain =
            labels.length >= 2 &&
            labels.every((label) =>
                /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label)
            ) &&
            /^[A-Za-z]{2,63}$/.test(labels[labels.length - 1]);

        return validLocal && validDomain
            ? { valid: true }
            : invalid;

    }
    validateUsername(value: string): ValidationResult {
        const username = value.trim();

        if (username.length < 2 || username.length > 30) {
            return {
                valid: false,
                error: "Use a username with 2–30 characters.",
            };
        }

        if (username.includes("@")) {
            return {
                valid: false,
                error: "Use a username, not an email address. The @ symbol is not allowed.",
            };
        }

        return { valid: true };
    }
    validatePassword(input: PasswordInput, messages = {
        short: "Password must have at least 8 characters.",
        mismatch: "Passwords do not match.",
    }): ValidationResult {
        if (input.password.length < 8) return { valid: false, error: messages.short };
        if (input.password !== input.confirmPassword) return { valid: false, error: messages.mismatch };
        return { valid: true };
    }
    validateLogin(input: LoginInput): ValidationResult {
        const email = this.validateEmail(input.email);
        if (!email.valid) return email;
        return this.validatePassword({ password: input.password, confirmPassword: input.password });
    }
    validateRegistration(input: RegisterInput): ValidationResult {
        const username = this.validateUsername(input.username);
        if (!username.valid) return username;

        const email = this.validateEmail(input.email);
        if (!email.valid) return email;

        return this.validatePassword(input);
    }
    validateRecoveryCode(code: string): ValidationResult {
        return /^\d{6}$/.test(code) ? { valid: true }
            : { valid: false, error: "That code didn't match. Check your inbox and try again." };
    }
}
