import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { ROLE_LABELS } from "@/types";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Cog,
  AlertTriangle,
  List,
  LogOut,
  HardHat,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const access = useRoleAccess();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", visible: access.canViewDashboard },
    { to: "/equipment", icon: Cog, label: "Equipment", visible: access.canViewEquipment },
    { to: "/report-downtime", icon: AlertTriangle, label: "Report Downtime", visible: access.canReportDowntime },
    { to: "/downtimes", icon: List, label: "Downtimes", visible: access.canViewDowntimes },
  ];

  const visibleItems = navItems.filter((n) => n.visible);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden rounded-md bg-sidebar p-2 text-sidebar-foreground"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar text-sidebar-foreground transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <HardHat className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">MineTrack</h1>
              <p className="text-xs text-sidebar-foreground/60">Downtime Tracker</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User info */}
          <div className="border-t border-sidebar-border p-4">
            <div className="mb-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60">
                {user?.role ? ROLE_LABELS[user.role] : ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
