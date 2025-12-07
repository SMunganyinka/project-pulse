// src/components/PublicLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Import Outlet
import Navbar from "./Navbar";
import Footer from "./Footer";

// 2. Remove the PublicLayoutProps interface, as we no longer need 'children'
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* 3. Replace {children} with <Outlet /> */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;