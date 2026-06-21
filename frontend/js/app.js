/* ═══════════════════════════════════════════════════
   app.js – Core utilities shared across all pages
   ═══════════════════════════════════════════════════ */

const API_BASE = 'http://localhost:8080/api/students';

/* ── Dark Mode ────────────────────────────────────── */
const darkToggle = document.getElementById('darkModeToggle');
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (darkToggle) darkToggle.checked = true;
}
if (darkToggle) {
    darkToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkToggle.checked);
        localStorage.setItem('darkMode', darkToggle.checked);
    });
}

/* ── Toast Notification ───────────────────────────── */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const body  = document.getElementById('toastBody');
    if (!toast || !body) return;
    body.textContent = message;
    toast.className = `toast align-items-center text-white border-0 bg-${type === 'success' ? 'success' : 'danger'}`;
    new bootstrap.Toast(toast, { delay: 3500 }).show();
}

/* ── Dashboard ────────────────────────────────────── */
async function loadDashboard() {
    try {
        const res  = await fetch(`${API_BASE}/dashboard`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const d = json.data;

        setText('totalStudents',   d.totalStudents);
        setText('activeStudents',  d.activeStudents);
        setText('inactiveStudents',d.inactiveStudents);
        setText('totalDepts',      d.totalDepartments);

        const tbody = document.getElementById('recentAdmissions');
        if (!tbody) return;
        if (!d.recentAdmissions || d.recentAdmissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No recent admissions</td></tr>';
            return;
        }
        tbody.innerHTML = d.recentAdmissions.map(s => `
            <tr>
                <td><span class="badge bg-primary">${s.studentId}</span></td>
                <td class="fw-semibold">${escHtml(s.fullName)}</td>
                <td>${escHtml(s.course || '–')}</td>
                <td>${escHtml(s.department || '–')}</td>
                <td>${formatDate(s.admissionDate)}</td>
                <td>${statusBadge(s.status)}</td>
            </tr>`).join('');
    } catch (e) {
        console.error('Dashboard error:', e);
        const tbody = document.getElementById('recentAdmissions');
        if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">${e.message}</td></tr>`;
    }
}

/* ── Helpers ──────────────────────────────────────── */
function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '–';
}

function escHtml(str) {
    if (!str) return '–';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(dateStr) {
    if (!dateStr) return '–';
    return new Date(dateStr).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

function statusBadge(status) {
    const map = { ACTIVE: 'badge-active', INACTIVE: 'badge-inactive', SUSPENDED: 'badge-suspended' };
    return `<span class="badge-status ${map[status] || 'badge-inactive'}">${status || 'UNKNOWN'}</span>`;
}
