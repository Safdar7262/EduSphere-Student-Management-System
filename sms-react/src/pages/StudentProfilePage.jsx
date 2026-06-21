import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, BadgeCheck } from 'lucide-react';
import { GlassCard, StatusBadge, Avatar, colorForId } from '../components/ui';
import { studentApi } from '../api/studentApi';

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-[13px] py-1.5">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value || '—'}</span>
    </div>
  );
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    studentApi.getById(id).then(setStudent).catch((e) => setError(e.message));
  }, [id]);

  async function handleDelete() {
    try {
      await studentApi.remove(id);
      navigate('/students');
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  }

  if (error) {
    return (
      <div className="px-6 lg:px-8 py-7">
        <GlassCard className="p-10 text-center text-rose-600 text-[13px]">{error}</GlassCard>
      </div>
    );
  }
  if (!student) {
    return (
      <div className="px-6 lg:px-8 py-7">
        <GlassCard className="p-16 text-center text-slate-400 text-[13px]">Loading…</GlassCard>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-7 space-y-5">
      <button
        onClick={() => navigate('/students')}
        className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> Back to Students
      </button>

      <GlassCard className="p-7">
        <div className="flex flex-wrap items-center gap-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
            style={{ background: `linear-gradient(135deg, ${colorForId(student.id)}, #8B5CF6)` }}
          >
            {student.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-slate-900">{student.fullName}</h2>
              <BadgeCheck size={17} className="text-indigo-500" />
            </div>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {student.studentId} · {student.course || '—'} {student.semester ? `· Semester ${student.semester}` : ''}
            </p>
            <div className="mt-2.5"><StatusBadge status={student.status} /></div>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => navigate(`/students/${id}/edit`)}
              className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-1.5 border border-rose-200 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-rose-600 hover:bg-rose-50"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassCard className="p-6">
          <h4 className="text-[13px] font-bold text-slate-700 mb-3">Personal Information</h4>
          <Row label="Email" value={student.email} />
          <Row label="Phone" value={student.phone} />
          <Row label="Gender" value={student.gender} />
          <Row label="Date of Birth" value={student.dob} />
        </GlassCard>

        <GlassCard className="p-6">
          <h4 className="text-[13px] font-bold text-slate-700 mb-3">Academic Information</h4>
          <Row label="Department" value={student.department} />
          <Row label="Course" value={student.course} />
          <Row label="Semester" value={student.semester} />
          <Row label="Admission Date" value={student.admissionDate} />
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2">
          <h4 className="text-[13px] font-bold text-slate-700 mb-3">Address</h4>
          <div className="grid grid-cols-2 gap-x-8">
            <Row label="Street" value={student.address} />
            <Row label="City" value={student.city} />
            <Row label="State" value={student.state} />
            <Row label="Country" value={student.country} />
            <Row label="ZIP Code" value={student.zipCode} />
            <Row label="Created" value={student.createdAt?.slice(0, 10)} />
          </div>
        </GlassCard>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <GlassCard className="p-6 max-w-sm w-full bg-white">
            <h3 className="font-bold text-slate-900 text-[16px] mb-2">Delete student?</h3>
            <p className="text-[13px] text-slate-500 mb-5">
              This will permanently remove <strong>{student.fullName}</strong>. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-rose-500 hover:bg-rose-600">
                Delete
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
