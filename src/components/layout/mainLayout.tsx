import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../chat/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar />
      <main className="flex-1 flex overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};