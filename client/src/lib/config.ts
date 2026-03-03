// API Configuration
const API_URL = import.meta.env.VITE_API_URL || '';

export const config = {
  apiUrl: API_URL,
  // Helper to build full API URLs
  getApiUrl: (path: string) => {
    // If path is already a full URL (for development relative paths), return as-is
    if (path.startsWith('http')) return path;
    // In production, prepend the API URL
    return API_URL ? `${API_URL}${path}` : path;
  },
};
