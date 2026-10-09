export type ValidationResult = { valid: true } | { valid: false; error: string };
export interface LoginInput { email: string; password: string }
export interface PasswordInput { password: string; confirmPassword: string }
export interface RegisterInput extends LoginInput, PasswordInput { username: string }
export type RecoveryStep = "email" | "code" | "password" | "done";