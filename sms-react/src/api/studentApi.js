// src/api/studentApi.js
//
// This file is the ONLY place that knows how to talk to the backend.
// It maps 1:1 to your existing StudentController.java endpoints.
// Nothing on the Spring Boot side needs to change.

// In dev, Vite's proxy (see vite.config.js) forwards "/api/*" to
// http://localhost:8080, so we can just use a relative path here.
// In production, set VITE_API_BASE_URL in a .env file.
const BASE = import.meta.env.VITE_API_BASE_URL || '/api/students';

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok || json.success === false) {
    // Same shape as your ApiResponse.java: { success, message, data }
    throw new Error(json.message || 'Something went wrong');
  }
  return json.data;
}

export const studentApi = {
  // GET /api/students?page=&size=&sortBy=&sortDir=
  getAll: async ({ page = 0, size = 10, sortBy = 'id', sortDir = 'asc' } = {}) => {
    const res = await fetch(`${BASE}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return handleResponse(res);
  },

  // GET /api/students/{id}
  getById: async (id) => {
    const res = await fetch(`${BASE}/${id}`);
    return handleResponse(res);
  },

  // GET /api/students/search?keyword=&page=&size=
  search: async (keyword, { page = 0, size = 10 } = {}) => {
    const res = await fetch(`${BASE}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    return handleResponse(res);
  },

  // GET /api/students/status/{status}
  getByStatus: async (status, { page = 0, size = 10 } = {}) => {
    const res = await fetch(`${BASE}/status/${status}?page=${page}&size=${size}`);
    return handleResponse(res);
  },

  // GET /api/students/dashboard
  getDashboard: async () => {
    const res = await fetch(`${BASE}/dashboard`);
    return handleResponse(res);
  },

  // POST /api/students
  create: async (studentData) => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  // PUT /api/students/{id}
  update: async (id, studentData) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  // DELETE /api/students/{id}
  remove: async (id) => {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // GET /api/students/export
  exportAll: async () => {
    const res = await fetch(`${BASE}/export`);
    return handleResponse(res);
  },
};
