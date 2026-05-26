"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Hide navbar and footer for admin pages
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('footer');
    const orbs = document.querySelectorAll('.bg-orb');
    
    if (navbar) (navbar as HTMLElement).style.display = 'none';
    if (footer) (footer as HTMLElement).style.display = 'none';
    orbs.forEach(orb => (orb as HTMLElement).style.display = 'none');

    // Cleanup on unmount
    return () => {
      if (navbar) (navbar as HTMLElement).style.display = '';
      if (footer) (footer as HTMLElement).style.display = '';
      orbs.forEach(orb => (orb as HTMLElement).style.display = '');
    };
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-container">
      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: #121212;
          overflow: hidden;
        }
        .sidebar-wrapper {
          width: 320px;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .main-content {
          flex: 1;
          min-height: 100vh;
          overflow-y: auto;
          padding: 3rem;
          background: #121212;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .main-content::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Webkit */
        }

        @media (max-width: 1024px) {
          .sidebar-wrapper {
            width: 0;
          }
          .main-content {
            padding: 5rem 1.5rem 2rem;
          }
        }
      `}</style>
      <div className="sidebar-wrapper">
        <AdminSidebar />
      </div>
      <div className="main-content">
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
