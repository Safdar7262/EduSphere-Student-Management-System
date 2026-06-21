/* ═══════════════════════════════════════════════════
   student.js – CRUD, Search, Pagination, Export
   ═══════════════════════════════════════════════════ */

/* ── State ────────────────────────────────────────── */
let currentPage   = 0;
let currentSort   = 'id';
let currentDir    = 'asc';
let searchTimer   = null;
let deleteTargetId = null;

/* ══════════════════════════════════════════════════
   LIST PAGE – Load & Render
══════════════════════════════════════════════════ */
async function loadStudents() {
    const tbody     = document.getElementById('studentsTableBody');
    if (!tbody) return;

    const keyword  = document.getElementById('searchInput')?.value.trim() || '';
    const status   = document.getElementById('statusFilter')?.value || '';
    const pageSize = document.getElementById('pageSizeSelect')?.value || 10;

    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-5">
        <div class="spinner-border text-primary"></div></td></tr>`;

    try {
        let url;
        if (keyword) {
            url = `${API_BASE}/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&size=${pageSize}`;
        } else if (status) {
            url = `${API_BASE}/status/${encodeURIComponent(status)}?page=${currentPage}&size=${pageSize}`;
        } else {
            url = `${API_BASE}?page=${currentPage}&size=${pageSize}&sortBy=${currentSort}&sortDir=${currentDir}`;
        }

        const res  = await fetch(url);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        renderTable(json.data);
        renderPagination(json.data);
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger py-4">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>${e.message}</td></tr>`;
    }
}

function renderTable(page) {
    const tbody = document.getElementById('studentsTableBody');
    if (!page.content || page.content.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-5 text-muted">
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>No students found</td></tr>`;
        return;
    }
    tbody.innerHTML = page.content.map(s => `
        <tr>
            <td><span class="badge bg-primary rounded-pill">${s.studentId}</span></td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="avatar-circle">${s.firstName[0]}${s.lastName[0]}</div>
                    <div>
                        <div class="fw-semibold">${escHtml(s.fullName)}</div>
                        <div class="text-muted" style="font-size:.78rem">${s.gender || ''}</div>
                    </div>
                </div>
            </td>
            <td style="font-size:.85rem">${escHtml(s.email)}</td>
            <td>${escHtml(s.phone)}</td>
            <td>${escHtml(s.department)}</td>
            <td style="font-size:.85rem">${escHtml(s.course)}</td>
            <td class="text-center">${s.semester ?? '–'}</td>
            <td>${statusBadge(s.status)}</td>
            <td class="text-center">
                <button class="btn-action btn-view me-1" title="View" onclick="viewStudent(${s.id})">
                    <i class="bi bi-eye"></i></button>
                <button class="btn-action btn-edit me-1" title="Edit" onclick="editStudent(${s.id})">
                    <i class="bi bi-pencil"></i></button>
                <button class="btn-action btn-delete" title="Delete" onclick="confirmDelete(${s.id})">
                    <i class="bi bi-trash"></i></button>
            </td>
        </tr>`).join('');
}

function renderPagination(page) {
    const info = document.getElementById('paginationInfo');
    const nav  = document.getElementById('pagination');
    if (!info || !nav) return;

    const start = page.number * page.size + 1;
    const end   = Math.min(start + page.size - 1, page.totalElements);
    info.textContent = `Showing ${start}–${end} of ${page.totalElements} students`;

    let html = '';
    // Prev
    html += `<li class="page-item ${page.first ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="goPage(${page.number - 1})"><i class="bi bi-chevron-left"></i></a></li>`;
    // Pages
    const total = page.totalPages;
    const cur   = page.number;
    for (let i = 0; i < total; i++) {
        if (total > 7 && Math.abs(i - cur) > 2 && i !== 0 && i !== total - 1) {
            if (i === 1 || i === total - 2) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
            continue;
        }
        html += `<li class="page-item ${i === cur ? 'active' : ''}">
            <a class="page-link" href="#" onclick="goPage(${i})">${i + 1}</a></li>`;
    }
    // Next
    html += `<li class="page-item ${page.last ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="goPage(${page.number + 1})"><i class="bi bi-chevron-right"></i></a></li>`;
    nav.innerHTML = html;
}

function goPage(p) {
    currentPage = p;
    loadStudents();
    return false;
}

function sortBy(field) {
    if (currentSort === field) currentDir = currentDir === 'asc' ? 'desc' : 'asc';
    else { currentSort = field; currentDir = 'asc'; }
    currentPage = 0;
    loadStudents();
}

function debounceSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { currentPage = 0; loadStudents(); }, 400);
}

function clearFilters() {
    const si = document.getElementById('searchInput');
    const sf = document.getElementById('statusFilter');
    if (si) si.value = '';
    if (sf) sf.value = '';
    currentPage = 0;
    loadStudents();
}

/* ══════════════════════════════════════════════════
   VIEW MODAL
══════════════════════════════════════════════════ */
async function viewStudent(id) {
    const body = document.getElementById('viewModalBody');
    body.innerHTML = `<div class="text-center py-4"><div class="spinner-border text-primary"></div></div>`;
    new bootstrap.Modal(document.getElementById('viewModal')).show();

    try {
        const res  = await fetch(`${API_BASE}/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const s = json.data;

        body.innerHTML = `
        <div class="text-center mb-4">
            <div class="avatar-lg mx-auto mb-3">${s.firstName[0]}${s.lastName[0]}</div>
            <h4 class="fw-bold mb-1">${escHtml(s.fullName)}</h4>
            <span class="badge bg-primary me-2">${s.studentId}</span>
            ${statusBadge(s.status)}
        </div>
        <div class="detail-grid">
            <div class="detail-item"><label>Email</label><p>${escHtml(s.email)}</p></div>
            <div class="detail-item"><label>Phone</label><p>${escHtml(s.phone)}</p></div>
            <div class="detail-item"><label>Gender</label><p>${escHtml(s.gender)}</p></div>
            <div class="detail-item"><label>Date of Birth</label><p>${formatDate(s.dob)}</p></div>
            <div class="detail-item"><label>Department</label><p>${escHtml(s.department)}</p></div>
            <div class="detail-item"><label>Course</label><p>${escHtml(s.course)}</p></div>
            <div class="detail-item"><label>Semester</label><p>${s.semester ?? '–'}</p></div>
            <div class="detail-item"><label>Admission Date</label><p>${formatDate(s.admissionDate)}</p></div>
            <div class="detail-item"><label>Address</label><p>${escHtml(s.address)}</p></div>
            <div class="detail-item"><label>City</label><p>${escHtml(s.city)}</p></div>
            <div class="detail-item"><label>State</label><p>${escHtml(s.state)}</p></div>
            <div class="detail-item"><label>Country</label><p>${escHtml(s.country)}</p></div>
            <div class="detail-item"><label>ZIP Code</label><p>${escHtml(s.zipCode)}</p></div>
            <div class="detail-item"><label>Created At</label><p>${formatDate(s.createdAt)}</p></div>
        </div>`;
    } catch (e) {
        body.innerHTML = `<p class="text-danger text-center">${e.message}</p>`;
    }
}

/* ══════════════════════════════════════════════════
   DELETE
══════════════════════════════════════════════════ */
function confirmDelete(id) {
    deleteTargetId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

document.getElementById('confirmDeleteBtn')?.addEventListener('click', async () => {
    if (!deleteTargetId) return;
    try {
        const res  = await fetch(`${API_BASE}/${deleteTargetId}`, { method: 'DELETE' });
        const json = await res.json();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        if (json.success) {
            showToast('Student deleted successfully', 'success');
            loadStudents();
        } else {
            showToast(json.message, 'error');
        }
    } catch (e) {
        showToast('Delete failed: ' + e.message, 'error');
    }
});

/* ── Navigate to Edit ─────────────────────────────── */
function editStudent(id) {
    window.location.href = `edit-student.html?id=${id}`;
}

/* ══════════════════════════════════════════════════
   ADD STUDENT (add-student.html)
══════════════════════════════════════════════════ */
function getFormData() {
    return {
        firstName:     document.getElementById('firstName')?.value.trim(),
        lastName:      document.getElementById('lastName')?.value.trim(),
        email:         document.getElementById('email')?.value.trim(),
        phone:         document.getElementById('phone')?.value.trim() || null,
        gender:        document.getElementById('gender')?.value,
        dob:           document.getElementById('dob')?.value || null,
        department:    document.getElementById('department')?.value,
        course:        document.getElementById('course')?.value,
        semester:      parseInt(document.getElementById('semester')?.value) || null,
        admissionDate: document.getElementById('admissionDate')?.value || null,
        status:        document.getElementById('status')?.value || 'ACTIVE',
        address:       document.getElementById('address')?.value.trim() || null,
        city:          document.getElementById('city')?.value.trim() || null,
        state:         document.getElementById('state')?.value.trim() || null,
        country:       document.getElementById('country')?.value.trim() || null,
        zipCode:       document.getElementById('zipCode')?.value.trim() || null,
    };
}

function validateForm(data) {
    let valid = true;
    const fields = [
        { id: 'firstName',  val: data.firstName,  msg: 'First name is required' },
        { id: 'lastName',   val: data.lastName,   msg: 'Last name is required' },
        { id: 'email',      val: data.email,       msg: 'Email is required' },
        { id: 'gender',     val: data.gender,      msg: 'Gender is required' },
        { id: 'department', val: data.department,  msg: 'Department is required' },
        { id: 'course',     val: data.course,      msg: 'Course is required' },
    ];
    // Clear previous errors
    document.querySelectorAll('.form-control, .form-select').forEach(el => el.classList.remove('is-invalid'));

    fields.forEach(f => {
        if (!f.val) {
            const el = document.getElementById(f.id);
            if (el) { el.classList.add('is-invalid'); }
            const errEl = document.getElementById(f.id + 'Err');
            if (errEl) errEl.textContent = f.msg;
            valid = false;
        }
    });
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        document.getElementById('email')?.classList.add('is-invalid');
        const errEl = document.getElementById('emailErr');
        if (errEl) errEl.textContent = 'Invalid email format';
        valid = false;
    }
    return valid;
}

async function submitStudent() {
    const data = getFormData();
    if (!validateForm(data)) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Adding…';

    try {
        const res  = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();

        if (json.success) {
            showToast('Student added successfully!', 'success');
            setTimeout(() => window.location.href = 'students.html', 1200);
        } else {
            showAlert(json.message || 'Failed to add student', 'danger');
        }
    } catch (e) {
        showAlert('Network error: ' + e.message, 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Add Student';
    }
}

function clearForm() {
    document.querySelectorAll('input, select').forEach(el => {
        if (el.type !== 'hidden' && el.id !== 'darkModeToggle') el.value = '';
    });
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.getElementById('status').value = 'ACTIVE';
}

/* ══════════════════════════════════════════════════
   EDIT STUDENT (edit-student.html)
══════════════════════════════════════════════════ */
async function loadStudentForEdit(id) {
    try {
        const res  = await fetch(`${API_BASE}/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const s = json.data;

        document.getElementById('editStudentId').value = s.id;
        document.getElementById('editSubtitle').textContent = `Editing: ${s.fullName} (${s.studentId})`;

        setVal('firstName',     s.firstName);
        setVal('lastName',      s.lastName);
        setVal('email',         s.email);
        setVal('phone',         s.phone);
        setVal('gender',        s.gender);
        setVal('dob',           s.dob);
        setVal('department',    s.department);
        setVal('course',        s.course);
        setVal('semester',      s.semester);
        setVal('admissionDate', s.admissionDate);
        setVal('status',        s.status);
        setVal('address',       s.address);
        setVal('city',          s.city);
        setVal('state',         s.state);
        setVal('country',       s.country);
        setVal('zipCode',       s.zipCode);

        document.getElementById('loadingSpinner').classList.add('d-none');
        document.getElementById('editFormCard').classList.remove('d-none');
    } catch (e) {
        document.getElementById('loadingSpinner').innerHTML =
            `<p class="text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i>${e.message}</p>`;
    }
}

async function updateStudent() {
    const id   = document.getElementById('editStudentId')?.value;
    const data = getFormData();
    if (!validateForm(data)) return;

    const btn = document.getElementById('updateBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Updating…';

    try {
        const res  = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();

        if (json.success) {
            showToast('Student updated successfully!', 'success');
            setTimeout(() => window.location.href = 'students.html', 1200);
        } else {
            showAlert(json.message || 'Failed to update student', 'danger');
        }
    } catch (e) {
        showAlert('Network error: ' + e.message, 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Update Student';
    }
}

/* ══════════════════════════════════════════════════
   CSV EXPORT
══════════════════════════════════════════════════ */
async function exportCSV() {
    try {
        const res  = await fetch(`${API_BASE}/export`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        const cols = ['studentId','fullName','email','phone','gender','dob','department','course','semester','status','admissionDate','city','country'];
        const headers = ['Student ID','Full Name','Email','Phone','Gender','DOB','Department','Course','Semester','Status','Admission Date','City','Country'];

        let csv = headers.join(',') + '\n';
        json.data.forEach(s => {
            csv += cols.map(c => `"${(s[c] ?? '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.download = `students_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSV exported successfully!', 'success');
    } catch (e) {
        showToast('Export failed: ' + e.message, 'error');
    }
}

/* ── Misc Helpers ─────────────────────────────────── */
function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== null && val !== undefined) el.value = val;
}

function showAlert(msg, type = 'danger') {
    const el = document.getElementById('formAlert');
    if (!el) return;
    el.className = `alert alert-${type}`;
    el.textContent = msg;
    el.classList.remove('d-none');
    setTimeout(() => el.classList.add('d-none'), 5000);
}

/* ── Avatar styles injected dynamically ───────────── */
const styleEl = document.createElement('style');
styleEl.textContent = `
.avatar-circle{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#818cf8);
  color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.75rem;flex-shrink:0}
.avatar-lg{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#818cf8);
  color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.5rem}
`;
document.head.appendChild(styleEl);
