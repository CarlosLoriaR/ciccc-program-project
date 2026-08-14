import api from './api';

// Uploads an image and gets back a persistent URL (stored server-side as base64, not tied
// to this browser tab) — replaces the old URL.createObjectURL() blob: URLs, which only ever
// worked for the current session and explain why photos "disappeared" for everyone else.
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<{ url: string }>('/users/me/photo', formData);
  return res.data.url;
};
