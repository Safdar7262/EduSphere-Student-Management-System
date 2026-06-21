import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-[20px] border backdrop-blur-xl shadow-[0_8px_30px_rgb(15,23,42,0.06)] ${className}`}
      style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(226,232,240,0.8)' }}
    >
      {children}
    </div>
  );
}

// Maps your backend's `status` string (ACTIVE / INACTIVE / SUSPENDED)
// to a colored pill. Add more keys here if you add more statuses later.
const STATUS_STYLES = {
  ACTIVE:    { bg: '#ECFDF5', text: '#059669', dot: '#10B981' },
  INACTIVE:  { bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' },
  SUSPENDED: { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.INACTIVE;
  return (
    <span
      style={{ background: s.bg, color: s.text }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
    >
      <span style={{ background: s.dot }} className="w-1.5 h-1.5 rounded-full" />
      {status}
    </span>
  );
}

export function Sparkline({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#spark-${color})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Re-usable initials avatar so list/table rows look consistent everywhere.
export function Avatar({ name, size = 36, color = '#6366F1' }) {
  const initials = (name || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      style={{ width: size, height: size, background: color, fontSize: size * 0.32 }}
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
    >
      {initials}
    </div>
  );
}

// Deterministic color per student id, so the same student always gets the
// same avatar color across renders/pages (no random flicker).
const PALETTE = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16'];
export function colorForId(id) {
  const n = typeof id === 'number' ? id : String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[n % PALETTE.length];
}
