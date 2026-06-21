import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { GlassCard } from '../components/ui';
import { studentApi } from '../api/studentApi';

// These options match what your original add-student.html / edit-student.html
// <select> elements offered. Edit freely — they're just UI hints, the backend
// accepts any string for course/department.
const DEPARTMENTS = [
  'Computer Science', 'Engineering', 'Business Administration', 'Mathematics',
  'Physics', 'Chemistry', 'Biology', 'Arts & Humanities', 'Medicine', 'Law',
];
const COURSES = [
  'B.Sc. Computer Science', 'B.Tech Software Engineering', 'BBA', 'MBA',
  'B.Sc. Mathematics', 'B.Sc. Physics', 'MBBS', 'LLB', 'B.A. Literature', 'B.Sc. Chemistry',
];

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '', gender: '',
  dob: '', department: '', course: '', semester: '', admissionDate: '',
  status: 'ACTIVE', address: '', city: '', state: '', country: '', zipCode: '',
};

function Field({ label, value, onChange, type = 'text', placeholder, error, required }) {
  return (
    <div>
      <label className="text-[12.5px] font-semibold text-slate-700 mb-1.5 block">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-[13px] outline-none transition placeholder:text-slate-400 ${
          error ? 'border-rose-300 focus:ring-4 focus:ring-rose-50' : 'border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'
        }`}
      />
      {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, error, required, placeholder = 'Select…' }) {
  return (
    <div>
      <label className="text-[12.5px] font-semibold text-slate-700 mb-1.5 block">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-[13px] outline-none transition text-slate-700 ${
          error ? 'border-rose-300' : 'border-slate-200 focus:border-indigo-400'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

export default function StudentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // present only in edit mode
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    studentApi
      .getById(id)
      .then((s) => {
        setForm({
          firstName: s.firstName || '', lastName: s.lastName || '', email: s.email || '',
          phone: s.phone || '', gender: s.gender || '', dob: s.dob || '',
          department: s.department || '', course: s.course || '',
          semester: s.semester ?? '', admissionDate: s.admissionDate || '',
          status: s.status || 'ACTIVE', address: s.address || '', city: s.city || '',
          state: s.state || '', country: s.country || '', zipCode: s.zipCode || '',
        });
      })
      .catch((e) => setServerError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.gender) e.gender = 'Gender is required';
    if (!form.department) e.department = 'Department is required';
    if (!form.course) e.course = 'Course is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);
    try {
      const payload = {
        ...form,
        semester: form.semester ? parseInt(form.semester, 10) : null,
        dob: form.dob || null,
        admissionDate: form.admissionDate || null,
      };
      if (isEdit) {
        await studentApi.update(id, payload);
      } else {
        await studentApi.create(payload);
      }
      navigate('/students');
    } catch (e) {
      setServerError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="px-6 lg:px-8 py-7">
        <GlassCard className="p-16 text-center text-slate-400 text-[13px]">Loading student…</GlassCard>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-7">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/students')}
          className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="font-bold text-slate-900 text-[16px]">{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
          <p className="text-[12.5px] text-slate-500">{isEdit ? `Updating ${form.firstName} ${form.lastName}` : 'Fill in the details below'}</p>
        </div>
      </div>

      <GlassCard className="p-7 max-w-4xl">
        {serverError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px]">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          <section>
            <h3 className="text-[13px] font-bold text-indigo-600 uppercase tracking-wide mb-3 pb-2 border-b border-slate-100">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <Field label="First Name" required value={form.firstName} onChange={(v) => set('firstName', v)} placeholder="John" error={errors.firstName} />
              <Field label="Last Name" required value={form.lastName} onChange={(v) => set('lastName', v)} placeholder="Doe" error={errors.lastName} />
              <Field label="Email" required type="email" value={form.email} onChange={(v) => set('email', v)} placeholder="john.doe@example.com" error={errors.email} />
              <Field label="Phone" value={form.phone} onChange={(v) => set('phone', v)} placeholder="+1234567890" error={errors.phone} />
              <Select label="Gender" required value={form.gender} onChange={(v) => set('gender', v)} options={['Male', 'Female', 'Other']} error={errors.gender} />
              <Field label="Date of Birth" type="date" value={form.dob} onChange={(v) => set('dob', v)} />
              <Select label="Status" value={form.status} onChange={(v) => set('status', v)} options={['ACTIVE', 'INACTIVE', 'SUSPENDED']} placeholder="ACTIVE" />
            </div>
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-indigo-600 uppercase tracking-wide mb-3 pb-2 border-b border-slate-100">
              Academic Information
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <Select label="Department" required value={form.department} onChange={(v) => set('department', v)} options={DEPARTMENTS} error={errors.department} />
              <Select label="Course" required value={form.course} onChange={(v) => set('course', v)} options={COURSES} error={errors.course} />
              <Select label="Semester" value={form.semester} onChange={(v) => set('semester', v)} options={['1','2','3','4','5','6','7','8']} />
              <Field label="Admission Date" type="date" value={form.admissionDate} onChange={(v) => set('admissionDate', v)} />
            </div>
          </section>

          <section>
            <h3 className="text-[13px] font-bold text-indigo-600 uppercase tracking-wide mb-3 pb-2 border-b border-slate-100">
              Address
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <Field label="Street Address" value={form.address} onChange={(v) => set('address', v)} placeholder="123 Main St" />
              </div>
              <Field label="City" value={form.city} onChange={(v) => set('city', v)} />
              <Field label="State" value={form.state} onChange={(v) => set('state', v)} />
              <Field label="Country" value={form.country} onChange={(v) => set('country', v)} />
              <Field label="ZIP Code" value={form.zipCode} onChange={(v) => set('zipCode', v)} />
            </div>
          </section>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white shadow-lg shadow-indigo-300/40 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
            >
              <Check size={15} /> {submitting ? 'Saving…' : isEdit ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
