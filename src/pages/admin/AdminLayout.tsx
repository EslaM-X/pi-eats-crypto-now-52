
import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const AdminLayout: React.FC = () => {
  const { isAdmin, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسؤولاً، قم بتوجيهه إلى صفحة تسجيل الدخول
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/30">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block w-64 bg-card shadow-md border-r border-border">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
