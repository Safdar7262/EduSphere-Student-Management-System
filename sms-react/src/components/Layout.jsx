import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ title, subtitle, dark, setDark, children }) {
  return (
    <div className="flex w-full min-h-screen" style={{ background: '#F8FAFC' }}>
      <Sidebar dark={dark} setDark={setDark} />
      <div className="flex-1 min-w-0">
        <Topbar title={title} subtitle={subtitle} />
        {children}
      </div>
    </div>
  );
}
