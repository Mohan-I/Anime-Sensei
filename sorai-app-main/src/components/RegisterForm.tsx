"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
} from "@/lib/validators";

interface RegisterFormProps {
    onClose: () => void;
}

interface FieldErrors {
    username?: string | null;
    email?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
    const { signUp } = useAuth();
    const [usernameField, setUsernameField] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleUsernameChange = (value: string) => {
        setUsernameField(value);
        setFieldErrors((prev) => ({
            ...prev,
            username: value ? validateUsername(value) : null,
        }));
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setFieldErrors((prev) => ({
            ...prev,
            email: value ? validateEmail(value) : null,
        }));
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (value) {
            setFieldErrors((prev) => ({
                ...prev,
                password: validatePassword(value),
                ...(confirmPassword
                    ? { confirmPassword: validateConfirmPassword(value, confirmPassword) }
                    : {}),
            }));
        } else {
            setFieldErrors((prev) => ({ ...prev, password: null }));
        }
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setFieldErrors((prev) => ({
            ...prev,
            confirmPassword: value ? validateConfirmPassword(password, value) : null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const errors: FieldErrors = {
            username: validateUsername(usernameField),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword: validateConfirmPassword(password, confirmPassword),
        };
        setFieldErrors(errors);

        if (Object.values(errors).some((e) => e !== null && e !== undefined)) return;

        setIsLoading(true);
        try {
            const { error: authError, needsConfirmation } = await signUp(
                email,
                password,
                usernameField
            );
            if (authError) {
                setError(authError);
                toast.error("Error creating account", { description: authError });
            } else if (needsConfirmation) {
                onClose();
                toast.info("Check your email", {
                    description: "We sent you a confirmation link to activate your account.",
                    duration: 8000,
                });
            } else {
                toast.success(`Welcome, ${usernameField || "user"}!`, {
                    description: "Your account was created and you are now signed in.",
                });
            }
        } catch {
            setError("An error occurred. Please try again.");
            toast.error("An unexpected error occurred");
        }
        setIsLoading(false);
    };

    return (
        <>
            {error && (
                <div className="mb-4 p-3 rounded-xl flex items-center gap-2 bg-red-50 border border-red-200">
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label className="block text-text-primary mb-1.5 text-sm font-medium">
                        Username
                    </label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={usernameField}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            placeholder="my_username"
                            maxLength={20}
                            className="w-full h-11 pl-9 pr-4 bg-surface-hover rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary placeholder-gray-400 transition-colors"
                            required
                        />
                    </div>
                    {fieldErrors.username && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-text-primary mb-1.5 text-sm font-medium">
                        Email
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            placeholder="email@example.com"
                            maxLength={254}
                            className="w-full h-11 pl-9 pr-4 bg-surface-hover rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary placeholder-gray-400 transition-colors"
                            required
                        />
                    </div>
                    {fieldErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-text-primary mb-1.5 text-sm font-medium">
                        Password
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="••••••••"
                            maxLength={64}
                            className="w-full h-11 pl-9 pr-10 bg-surface-hover rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary placeholder-gray-400 transition-colors"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-secondary"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {fieldErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                    )}
                </div>

                {/* Confirm password */}
                <div>
                    <label className="block text-text-primary mb-1.5 text-sm font-medium">
                        Confirm password
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                            placeholder="Re-enter your password"
                            maxLength={64}
                            className="w-full h-11 pl-9 pr-4 bg-surface-hover rounded-xl border border-border focus:border-primary focus:outline-none text-text-primary placeholder-gray-400 transition-colors"
                            required
                        />
                    </div>
                    {fieldErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 text-white rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{
                        background: isLoading
                            ? "var(--color-primary-gradient)"
                            : "linear-gradient(135deg, var(--color-primary), var(--color-primary-medium))",
                    }}
                >
                    {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <UserPlus size={16} />
                            Create Account
                        </>
                    )}
                </button>
            </form>
        </>
    );
}
