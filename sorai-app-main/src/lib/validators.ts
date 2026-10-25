// Shared validation functions for frontend and backend
// Each returns null if valid, or error message string if invalid

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export function validateUsername(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return "Username is required";
    if (trimmed.length < 3) return "El nombre de usuario debe tener al menos 3 caracteres";
    if (trimmed.length > 20) return "El nombre de usuario no puede superar los 20 caracteres";
    if (!USERNAME_REGEX.test(trimmed))
        return "El nombre de usuario solo puede contener letras, números y guión bajo";
    return null;
}

export function validateEmail(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required";
    if (trimmed.includes(" ")) return "Ingresa un correo electrónico válido";
    if (trimmed.length > 254) return "Ingresa un correo electrónico válido";
    if (!EMAIL_REGEX.test(trimmed)) return "Ingresa un correo electrónico válido";
    return null;
}

export function validatePassword(value: string): string | null {
    if (!value) return "Password is required";
    if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    if (value.length > 64) return "La contraseña no puede superar los 64 caracteres";
    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value))
        return "La contraseña debe incluir al menos una mayúscula, una minúscula y un número";
    return null;
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
    if (!confirm) return "Please confirm your password";
    if (password !== confirm) return "Las contraseñas no coinciden";
    return null;
}

export function validateSearch(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return "Enter a search term";
    if (trimmed.length < 3) return "Enter at least 3 characters";
    return null;
    // Max 100 is enforced by maxLength on the input
}

const AVATAR_VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2MB

export function validateAvatarFile(file: File): string | null {
    if (!AVATAR_VALID_TYPES.includes(file.type))
        return "Solo se permiten imágenes en formato JPG, PNG o WebP";
    if (file.size > AVATAR_MAX_SIZE)
        return "La imagen no puede superar los 2MB";
    return null;
}
