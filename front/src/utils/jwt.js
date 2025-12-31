import { jwtDecode } from "jwt-decode";

// Decodifica el payload del token
export function decodeToken(token) {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (e) {
        console.error("Error al decodificar token", e);
        return null;
    }
}

// Verifica si el token expiró
export function isTokenExpired(token) {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;

    const now = Date.now() / 1000;
    return payload.exp < now;
}
