"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { validateEmail } from "@/lib/validators";

interface LoginFormProps {
    onClose: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setEmailError(value ? validateEmail(value) : null);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setPasswordError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const eErr = validateEmail(email);
        const pErr = !password ? "Password is required" : null;
        setEmailError(eErr);
        setPasswordError(pErr);
        if (eErr || pErr) return;

        setIsLoading(true);
        try {
            const { error: authError } = await signIn(email, password);
            if (authError) {
                setError(authError);
                toast.error("Login failed", { description: authError });
            } else {
                toast.success("Welcome back!", {
                    description: "You have signed in successfully.",
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
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
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
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
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
                            <LogIn size={16} />
                            Sign In
                        </>
                    )}
                </button>
            </form>
        </>
    );
}
