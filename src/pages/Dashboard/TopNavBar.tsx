import { Bell, CirclePlus, LogOut, User, Settings, Home, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import api from "../../lib/api";
import useUserStore from "../../Store/userStore";

interface TopNavBarProps {
  pageTitle?: string;
  subTitle?: string;
}

const TopNavBar = ({
  pageTitle = "Notely App",
  subTitle = "",
}: TopNavBarProps) => {
  const { emailAddress, firstName, lastName,  clearUser } = useUserStore();
  const navigate = useNavigate();
  const isLoggedIn = !!emailAddress;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      clearUser();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
      clearUser();
      navigate("/");
    }
  };

  const getUserInitials = () => {
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (lastName) {
      return lastName.slice(0, 2).toUpperCase();
    }
    return "NA";
  };
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-emerald-100/50 sticky top-0 z-40 flex w-full flex-col gap-4 px-6 py-4 shadow-sm lg:ml-72">
      <div className="flex flex-wrap items-center gap-4 w-full">
        {/* User avatar */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex w-12 h-12 items-center justify-center rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <Link to="/dashboard" className="text-white">
          {isLoggedIn ? getUserInitials() : "U"}
          </Link>
        </div>

        {/* Page title section */}
        <div className="min-w-[180px] flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Dashboard
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-800 leading-tight">
            <Link to="/dashboard" className="hover:text-emerald-600 transition-colors">
            {pageTitle}
            </Link>
            </p>
          {subTitle && <p className="text-sm text-gray-600 mt-1">{subTitle}</p>}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2" 
                asChild
              >
                <Link to="/dashboard/notes/new">
                  <CirclePlus className="w-4 h-4" />
                  New note
                </Link>
              </Button>

              {/* Notifications button */}
              <Button 
                variant="outline" 
                size="icon" 
                className="border-emerald-200 hover:bg-emerald-50 text-emerald-600"
              >
                <Bell className="w-4 h-4" />
              </Button>

              {/* User dropdown */}
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex w-10 h-10 items-center justify-center rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-200">
                  {getUserInitials()}
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 bg-white border border-emerald-100/50 shadow-xl rounded-2xl ring-1 ring-emerald-100/50 focus:outline-none z-50 overflow-hidden">
                    <div className="py-2">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-emerald-100/50">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex w-8 h-8 items-center justify-center rounded-full text-sm font-semibold">
                            {getUserInitials()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{firstName} {lastName}</p>
                            <p className="text-xs text-emerald-600">Author</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`block px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                              active ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Home className="w-4 h-4" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/notes"
                            className={`block px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                              active ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                            My Notes
                          </Link>
                        )}
                      </Menu.Item>
                      
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/profile"
                            className={`block px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                              active ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/settings"
                            className={`block px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                              active ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      
                      <div className="border-t border-emerald-100/50">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                                active ? "bg-red-50 text-red-600" : "text-red-600 hover:bg-red-50"
                              }`}
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          ) : (
            <Button 
              asChild
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to="/dashboard/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
