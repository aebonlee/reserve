import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard';
import AdminGuard from '../components/common/AdminGuard';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home = lazy(() => import('../pages/Home'));
const Schedule = lazy(() => import('../pages/Schedule'));
const ScheduleDetail = lazy(() => import('../pages/ScheduleDetail'));
const MyReservations = lazy(() => import('../pages/MyReservations'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const MyPage = lazy(() => import('../pages/MyPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ScheduleManage = lazy(() => import('../pages/admin/ScheduleManage'));
const ReservationManage = lazy(() => import('../pages/admin/ReservationManage'));
const NotFound = lazy(() => import('../pages/NotFound'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div className="loading-spinner"></div>
  </div>
);

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Schedule */}
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/schedule/:id" element={<ScheduleDetail />} />

            {/* Reservations */}
            <Route path="/my-reservations" element={<AuthGuard><MyReservations /></AuthGuard>} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/mypage" element={<AuthGuard><MyPage /></AuthGuard>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/schedules" element={<AdminGuard><ScheduleManage /></AdminGuard>} />
            <Route path="/admin/reservations" element={<AdminGuard><ReservationManage /></AdminGuard>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
