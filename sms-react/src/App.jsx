import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentFormPage from './pages/StudentFormPage';
import StudentProfilePage from './pages/StudentProfilePage';

const META = {
  '/': { title: 'Dashboard', subtitle: "Welcome back! Here's what's happening." },
  '/students': { title: 'Students Management', subtitle: 'View, search, and manage all enrolled students.' },
  '/students/new': { title: 'Add Student', subtitle: 'Fill in the details to enroll a new student.' },
};

function pageMeta(pathname) {
  if (META[pathname]) return META[pathname];
  if (pathname.endsWith('/edit')) return { title: 'Edit Student', subtitle: 'Update student details.' };
  if (pathname.startsWith('/students/')) return { title: 'Student Profile', subtitle: 'Full academic and personal record.' };
  return META['/'];
}

export default function App() {
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const meta = pageMeta(location.pathname);

  return (
    <Layout title={meta.title} subtitle={meta.subtitle} dark={dark} setDark={setDark}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/new" element={<StudentFormPage />} />
        <Route path="/students/:id" element={<StudentProfilePage />} />
        <Route path="/students/:id/edit" element={<StudentFormPage />} />
      </Routes>
    </Layout>
  );
}

