import type { LoginInput, PasswordInput, RegisterInput, ValidationResult } from "../types/auth";

/** Shared rules; UI wording may differ between forms. Never stores passwords. */
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
        if (!input.username.trim()) return { valid: false, error: "username ang ilagay" };
        const email = this.validateEmail(input.email);
        if (!email.valid) return email;
        return this.validatePassword(input, { short: "8 characters ang password.", mismatch: "Ulit, mali password mo" });
    }
    validateRecoveryCode(code: string): ValidationResult {
        return /^\d{6}$/.test(code) ? { valid: true }
            : { valid: false, error: "That code didn't match. Check your inbox and try again." };
    }
}
