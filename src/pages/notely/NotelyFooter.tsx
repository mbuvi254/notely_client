import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const notelyLinks = [
  { label: "Home", href: "/" },
  { label: "All Notes", href: "/public/notes" },
  // { label: "Dashboard", href: "/dashboard" },
];

const NotelyFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t-2 border-emerald-200/70 mt-12 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <Link 
              to="/" 
              className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent"
            >
              Notely
            </Link>
            <nav className="flex space-x-4">
              {notelyLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-sm px-3 py-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-emerald-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/dashboard/register"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Notely. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NotelyFooter;