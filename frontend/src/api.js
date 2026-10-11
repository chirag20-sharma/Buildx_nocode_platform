export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function getToken() {
    return localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

export async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${path}`, {
        credentials: 'include',
        ...options,
        headers,
    });

    if (res.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
    }

    return res.json();
}
