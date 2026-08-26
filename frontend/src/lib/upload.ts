import api from './api';

// Persistent server-side URL, not a local blob: URL — those only worked for the uploading tab.
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<{ url: string }>('/users/me/photo', formData);
  return res.data.url;
};
