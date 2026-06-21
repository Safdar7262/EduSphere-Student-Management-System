import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, GraduationCap as GradCap,
  Moon, Sun,
} from 'lucide-react';

// Only the pages that actually exist & connect to your real backend.
// (The original design brief had Faculty/Exams/Fees/etc — add routes here
// later if you build those backend endpoints too.)
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/students/new', label: 'Add Student', icon: UserPlus },
];

export default function Sidebar({ dark, setDark }) {
  return (
    <aside
      className="hidden lg:flex flex-col w-[264px] shrink-0 h-screen sticky top-0 overflow-y-auto"
      style={{ background: 'linear-gradient(165deg, #4338CA 0%, #6D28D9 55%, #7E22CE 100%)' }}
    >
      <div className="flex items-center gap-3 px-6 py-7">
        <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-inner">
          <GradCap size={22} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-[15px] leading-tight tracking-tight">EduSphere</p>
          <p className="text-white/50 text-[11px] font-medium">Student Management</p>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-700 bg-white shadow-lg shadow-black/10'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} strokeWidth={2.2} className={isActive ? 'text-indigo-600' : ''} />
                  <span>{item.label}</span>
                  {isActive && <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <div className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-white/10 backdrop-blur">
          <div className="flex items-center gap-2.5 text-white/80 text-[13px] font-medium">
            {dark ? <Moon size={16} /> : <Sun size={16} />}
            Dark Mode
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-5 rounded-full relative transition-colors"
            style={{ background: dark ? '#A78BFA' : 'rgba(255,255,255,0.25)' }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
              style={{ left: dark ? 18 : 2 }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
