"use client";

import { useEffect } from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function AuthModal() {
    const { openModal, setOpenModal } = useAuth();

    const isLogin = openModal === "login";
    const isRegister = openModal === "register";
    const isOpen = isLogin || isRegister;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => setOpenModal(null);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
                backgroundColor: "var(--color-overlay-medium)",
                backdropFilter: "blur(4px)",
            }}
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-in">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-light">
                                    {isLogin ? (
                                        <LogIn size={16} className="text-primary" />
                                    ) : (
                                        <UserPlus size={16} className="text-primary" />
                                    )}
                                </div>
                                <h2 className="text-text-primary text-[1.375rem] font-medium">
                                    {isLogin ? "Sign In" : "Create Account"}
                                </h2>
                            </div>
                            <p className="text-text-secondary text-sm">
                                {isLogin
                                    ? "Welcome back to Sorai"
                                    : "Join the Sorai community"}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    {isLogin ? (
                        <LoginForm onClose={handleClose} />
                    ) : (
                        <RegisterForm onClose={handleClose} />
                    )}

                    {/* Toggle */}
                    <p className="text-center text-text-secondary mt-5 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setOpenModal(isLogin ? "register" : "login")}
                            className="text-primary hover:underline transition-colors"
                        >
                            {isLogin ? "Sign up free" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
