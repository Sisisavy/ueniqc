import { Outlet } from "react-router-dom";
import Sidebar from "./components/shared/sidebar";
export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}