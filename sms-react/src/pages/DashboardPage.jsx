import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CheckCircle2, BookOpen, UserX, ArrowUpRight, UserPlus,
} from 'lucide-react';
import { GlassCard, StatusBadge, Avatar, colorForId } from '../components/ui';
import { studentApi } from '../api/studentApi';

// Static sparkline shapes just for visual texture on the stat cards —
// purely decorative since your backend doesn't track historical counts yet.
const sparkA = [{v:4},{v:7},{v:5},{v:9},{v:8},{v:12},{v:10},{v:14}];
const sparkB = [{v:8},{v:6},{v:9},{v:7},{v:11},{v:9},{v:13},{v:12}];
const sparkC = [{v:3},{v:5},{v:4},{v:8},{v:6},{v:9},{v:8},{v:11}];

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <GlassCard className="p-5 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(99,102,241,0.12)] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <p className="text-slate-500 text-[12.5px] font-medium mt-4">{label}</p>
      <p className="text-[26px] font-bold text-slate-900 tracking-tight mt-0.5">
        {loading ? '–' : value}
      </p>
    </GlassCard>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi
      .getDashboard()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-6 lg:px-8 py-7 space-y-6">
      {error && (
        <GlassCard className="p-4 border-rose-200 bg-rose-50/80 text-rose-700 text-[13px]">
          Could not reach the backend: {error}. Is Spring Boot running on port 8080?
        </GlassCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Total Students" value={stats?.totalStudents} color="#6366F1" loading={loading} />
        <StatCard icon={CheckCircle2} label="Active Students" value={stats?.activeStudents} color="#10B981" loading={loading} />
        <StatCard icon={UserX} label="Inactive Students" value={stats?.inactiveStudents} color="#EF4444" loading={loading} />
        <StatCard icon={BookOpen} label="Departments" value={stats?.totalDepartments} color="#8B5CF6" loading={loading} />
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-[15px]">Recent Admissions</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Latest students added to the system</p>
          </div>
          <Link
            to="/students/new"
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12.5px] font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
          >
            <UserPlus size={14} /> Add Student
          </Link>
        </div>

        {loading ? (
          <p className="text-[13px] text-slate-400 py-6 text-center">Loading…</p>
        ) : !stats?.recentAdmissions?.length ? (
          <p className="text-[13px] text-slate-400 py-6 text-center">No students yet. Add your first one!</p>
        ) : (
          <div className="space-y-2">
            {stats.recentAdmissions.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition">
                <Avatar name={s.fullName} color={colorForId(s.id)} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-slate-800 truncate">{s.fullName}</p>
                  <p className="text-[11.5px] text-slate-400 truncate">{s.course || '—'} · {s.studentId}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
