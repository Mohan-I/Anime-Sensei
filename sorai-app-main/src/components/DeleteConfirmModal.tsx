"use client";

import React from "react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    animeTitle: string;
    isDeleting?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    animeTitle,
    isDeleting = false,
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
                backgroundColor: "var(--color-overlay-light)",
                backdropFilter: "blur(4px)",
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-surface rounded-2xl max-w-md w-full p-8 shadow-2xl animate-modal-in">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path
                            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                            stroke="var(--color-error)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <h2 className="text-xl text-text-primary text-center mb-2 font-medium">
                    Remove from your list?
                </h2>
                <p className="text-text-secondary text-center mb-6 text-sm">
                    will be removed from your list.{" "}
                    <span className="text-text-primary font-medium">
                        &ldquo;{animeTitle}&rdquo;
                    </span>{" "}
                    This action cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 h-11 border-2 border-border text-text-primary rounded-xl hover:bg-surface-alt transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 h-11 bg-error text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {isDeleting ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
