import React from 'react';
import Sidebar from '../shared/sidebar'; // This points correctly to src/components/shared/sidebar.jsx

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed width on the left */}
      <aside className="w-64 border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}