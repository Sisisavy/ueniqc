import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, AlertTriangle, FileText, Settings, Shield, ChevronLeft, ChevronRight, Webhook } from "lucide-react";
import { cn } from "../../lib/utils"
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Flagged Tickets", path: "/flagged", icon: AlertTriangle },
  { label: "All Tickets", path: "/tickets", icon: FileText },
  { label: "QC Guidelines", path: "/guidelines", icon: Settings },
  { label: "Webhook API", path: "/webhook", icon: Webhook },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 sticky top-0 border-r border-sidebar-border",
      collapsed ? "w-[68px]" : "w-[240px]"
    )}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 border border-sidebar-primary/40 flex items-center justify-center flex-shrink-0">
          <Shield className="w-3.5 h-3.5 text-sidebar-primary" />
        </div>
        {!collapsed && (
          <span className="font-display text-lg tracking-widest text-sidebar-foreground/90 truncate uppercase">QC Monitor</span>
        )}
      </div>

      <nav className="flex-1 py-6 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium tracking-widest uppercase transition-all duration-150",
                isActive
                  ? "text-sidebar-primary bg-sidebar-accent"
                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground/80 hover:bg-sidebar-accent/40"
              )}
            >
              <item.icon className={cn("w-[16px] h-[16px] flex-shrink-0", isActive ? "text-sidebar-primary" : "")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground/30 hover:text-sidebar-foreground/60 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}