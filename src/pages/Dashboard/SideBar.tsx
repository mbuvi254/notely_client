// src/components/dashboard/SideBar.tsx
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  LogOut,
  PenSquare,
  Trash,
  Eye,
  Settings,
  Home,
  Archive,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import userStore from "../../Store/userStore"
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

type MenuItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
};



const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: Home },
      { label: "Notes", path: "/dashboard", icon: FileText, badge: "0" },
      { label: "New Note", path: "/dashboard/notes/new", icon: PenSquare },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Privacy", path: "/dashboard/notes/privacy", icon: Eye },
      { label: "Archive", path: "/dashboard/notes/archive", icon: Archive },
      { label: "Trash", path: "/dashboard/notes/trash", icon: Trash, badge: "0" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Settings", path: "/dashboard/settings", icon: Settings },
    ],
  }
];

const SideBar = () => {
  const { pathname } = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

    // const emailAddress = userStore(state => state.emailAddress);
    const firstName = userStore(state => state.firstName);
    const lastName = userStore(state=> state.lastName);
    // const username = userStore(state=>state.username)

    const navigate = useNavigate();
    const { clearUser } = userStore();

    const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      clearUser();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
      clearUser();
      navigate("/dashboard/login");
    }
  };


  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="bg-white/90 text-emerald-600 border-emerald-200 fixed left-4 top-[5.5rem] z-40 shadow-lg hover:bg-emerald-50 lg:hidden"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open dashboard menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "bg-white/80 backdrop-blur-sm border-emerald-100/50 flex h-full w-72 flex-col border-r shadow-xl",
          "fixed inset-y-0 left-0 z-50 -translate-x-full transition-transform duration-300 lg:fixed lg:translate-x-0",
          isMobileOpen && "translate-x-0"
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-emerald-100/50 px-4 py-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Navigation</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeMobile} 
            aria-label="Close dashboard menu"
            className="hover:bg-emerald-50"
          >
            <X className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Logo section for desktop */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-6 border-b border-emerald-100/50">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Notely</h2>
            <p className="text-xs text-emerald-600">Note Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive || pathname.startsWith(item.path)
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                          : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                      )
                    }
                    onClick={closeMobile}
                  >
                    <item.icon className="size-4" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && item.badge !== "0" ? (
                      <span className="bg-white/20 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                        {item.badge}
                      </span>
                    ) : item.badge === "0" ? (
                      <span className="text-gray-400 rounded-full px-2 py-0.5 text-xs font-semibold">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile section */}
        <div className="border-t border-emerald-100/50 space-y-4 px-6 py-6">
          <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-lg">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex size-10 items-center justify-center rounded-full text-sm font-semibold shadow-md">
              {firstName?.[0]}{lastName?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{firstName} {lastName}</p>
              <p className="text-xs text-emerald-600">Author</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            size="sm" 
            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 justify-start"
          >
            <LogOut className="mr-2 size-4" />
            Log out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
