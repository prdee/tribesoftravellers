const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  get: (path: string) => fetch(`${BASE_URL}${path}`, { headers: getHeaders() }).then(r => r.json()),
  post: (path: string, body: unknown) => fetch(`${BASE_URL}${path}`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(r => r.json()),
  put: (path: string, body: unknown) => fetch(`${BASE_URL}${path}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(r => r.json()),
  delete: (path: string) => fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),
};
