import axios, { type AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true, // send/receive the httpOnly refresh-token cookie
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function unwrap(response: AxiosResponse): AxiosResponse {
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    response.data = (response.data as { data: unknown }).data;
  }
  return response;
}

// Backend wraps every response as { success, data } (or { success: false, error }).
// Unwrap it here so call sites can keep using res.data as the actual payload.
api.interceptors.response.use(
  (response) => unwrap(response),
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = ['/auth/login', '/auth/register', '/auth/refresh'].some((path) =>
      originalRequest?.url?.includes(path),
    );

    // Access tokens are short-lived (15 min) — on a 401, try one silent refresh
    // and retry the original request before giving up.
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const refreshRes = await api.post<{ accessToken: string }>('/auth/refresh');
        const { accessToken } = refreshRes.data as unknown as { accessToken: string };
        localStorage.setItem('token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        return Promise.reject(refreshError);
      }
    }

    const backendMessage = error?.response?.data?.error?.message;
    if (backendMessage) {
      error.message = backendMessage;
    }
    return Promise.reject(error);
  },
);

export default api;
