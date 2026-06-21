import { Search, Bell } from 'lucide-react';

export default function Topbar({ title, subtitle }) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 lg:px-8 py-5 sticky top-0 z-20 backdrop-blur-xl bg-[#F8FAFC]/80 border-b border-slate-200/70">
      <div>
        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 w-72 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Search students…"
            className="bg-transparent outline-none text-[13px] placeholder:text-slate-400 w-full"
          />
        </div>
        <button className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition">
          <Bell size={17} className="text-slate-600" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-2xl pl-1.5 pr-3 py-1.5 shadow-sm">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px]"
            style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
          >
            AD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[12.5px] font-semibold text-slate-800 leading-tight">Admin</p>
            <p className="text-[10.5px] text-slate-400 leading-tight">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
