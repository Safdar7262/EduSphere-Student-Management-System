import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Download,
} from 'lucide-react';
import { GlassCard, StatusBadge, Avatar, colorForId } from '../components/ui';
import { studentApi } from '../api/studentApi';

const PAGE_SIZE = 8;

export default function StudentsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Debounce search input by 400ms (same idea as your original student.js)
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (debouncedQuery.trim()) {
        result = await studentApi.search(debouncedQuery.trim(), { page, size: PAGE_SIZE });
      } else if (statusFilter) {
        result = await studentApi.getByStatus(statusFilter, { page, size: PAGE_SIZE });
      } else {
        result = await studentApi.getAll({ page, size: PAGE_SIZE });
      }
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 0 whenever filters change
  useEffect(() => { setPage(0); }, [debouncedQuery, statusFilter]);

  async function handleDelete(id) {
    try {
      await studentApi.remove(id);
      setDeleteTarget(null);
      load();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  }

  async function handleExport() {
    try {
      const all = await studentApi.exportAll();
      const cols = ['studentId', 'fullName', 'email', 'phone', 'department', 'course', 'status'];
      const headers = ['Student ID', 'Full Name', 'Email', 'Phone', 'Department', 'Course', 'Status'];
      let csv = headers.join(',') + '\n';
      all.forEach((s) => {
        csv += cols.map((c) => `"${(s[c] ?? '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed: ' + e.message);
    }
  }

  return (
    <div className="px-6 lg:px-8 py-7 space-y-5">
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 flex-1 max-w-md">
              <Search size={15} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, department…"
                className="bg-transparent outline-none text-[13px] w-full placeholder:text-slate-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-[13px] text-slate-600 outline-none font-medium"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <Download size={14} /> Export CSV
            </button>
            <Link
              to="/students/new"
              className="flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-indigo-300/40"
              style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
            >
              <Plus size={15} /> Add Student
            </Link>
          </div>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="p-4 border-rose-200 bg-rose-50/80 text-rose-700 text-[13px]">
          {error}
        </GlassCard>
      )}

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-slate-50/80 backdrop-blur">
              <tr>
                {['Student', 'Course', 'Email', 'Phone', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-[13px]">Loading…</td></tr>
              ) : data.content.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400 text-[13px]">No students found</td></tr>
              ) : (
                data.content.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100 hover:bg-indigo-50/30 transition group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.fullName} color={colorForId(s.id)} size={36} />
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800">{s.fullName}</p>
                          <p className="text-[11px] text-slate-400">{s.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12.5px] text-slate-600">{s.course || '—'}</td>
                    <td className="px-5 py-3.5 text-[12.5px] text-slate-600">{s.email}</td>
                    <td className="px-5 py-3.5 text-[12.5px] text-slate-600">{s.phone || '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition">
                        <button
                          onClick={() => navigate(`/students/${s.id}`)}
                          className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/students/${s.id}/edit`)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
          <p className="text-[12px] text-slate-500">
            {data.totalElements === 0
              ? 'No results'
              : `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, data.totalElements)} of ${data.totalElements} students`}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: data.totalPages || 1 }, (_, i) => i).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition ${
                  page === n ? 'text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 border border-slate-200'
                }`}
                style={page === n ? { background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' } : {}}
              >
                {n + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min((data.totalPages || 1) - 1, p + 1))}
              disabled={page >= (data.totalPages || 1) - 1}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <GlassCard className="p-6 max-w-sm w-full bg-white">
            <h3 className="font-bold text-slate-900 text-[16px] mb-2">Delete student?</h3>
            <p className="text-[13px] text-slate-500 mb-5">
              This will permanently remove <strong>{deleteTarget.fullName}</strong>. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-rose-500 hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
