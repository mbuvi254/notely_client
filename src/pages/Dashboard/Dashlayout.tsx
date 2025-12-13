import { type ReactNode } from "react";
import SideBar from "./SideBar";
import TopNavBar from "./TopNavBar";
import { ToastContainer } from "react-toastify";
import { Calendar, TrendingUp, Activity } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 min-h-screen flex flex-col">
      <TopNavBar />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        <main className="flex-1 overflow-y-auto lg:ml-72">
          <section className="space-y-8 px-8 py-6">
            {title && (
              <div className="space-y-6">
                {/* Date and status bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-sm">
                  <div className="flex items-center gap-3 text-sm font-medium text-emerald-600">
                    <Calendar className="w-4 h-4" />
                    <span className="uppercase tracking-wide">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-600 font-medium">Active</span>
                  </div>
                </div>

                {/* Page header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                        {title}
                      </h1>
                      {subtitle && (
                        <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">{subtitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="h-1 w-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>Dashboard</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toast container only */}
            <ToastContainer />

            {/* Dynamic content */}
            <div className="space-y-6">{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
