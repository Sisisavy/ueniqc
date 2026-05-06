import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Upload, Settings } from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Upload Data", path: "/upload", icon: Upload },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-8 px-2 tracking-tight">QC App</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <item.icon className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-700">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}