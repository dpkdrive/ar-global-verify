const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const getStoredToken = () => localStorage.getItem('ar_access_token');
const setStoredToken = (token) => token ? localStorage.setItem('ar_access_token', token) : localStorage.removeItem('ar_access_token');

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.message ?? 'Something went wrong. Please try again.', response.status, payload.error?.details);
  return payload;
};

const refreshAccessToken = async () => {
  const payload = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' }).then(parseResponse);
  setStoredToken(payload.data.accessToken);
  return payload.data.accessToken;
};

export const apiRequest = async (path, { method = 'GET', body, token = getStoredToken(), retry = true } = {}) => {
  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: { ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  });

  if (response.status === 401 && token && retry) {
    try { return apiRequest(path, { method, body, token: await refreshAccessToken(), retry: false }); } catch { setStoredToken(null); }
  }
  return parseResponse(response);
};

export const authApi = {
  token: getStoredToken,
  setToken: setStoredToken,
  login: (body) => apiRequest('/auth/login', { method: 'POST', body, token: null }),
  logout: () => apiRequest('/auth/logout', { method: 'POST', token: null }),
  me: () => apiRequest('/auth/me'),
};
