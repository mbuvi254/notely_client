import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuLink, NavigationMenuList } from "../../components/ui/navigation-menu";
import { ArrowRight } from "lucide-react";

const notelyLinks = [
  { label: "Home", href: "/" },
  { label: "All Notes", href: "/public/notes" },
  // { label: "Dashboard", href: "/dashboard" },
];

const NotelyNav = () => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-emerald-100/50">
      <Link 
        to="/" 
        className="text-3xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent"
      >
        Notely
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="gap-2">
          {notelyLinks.map((link) => (
            <NavigationMenuLink key={link.label} asChild>
              <Link 
                to={link.href} 
                className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50
                  hover:text-emerald-700 hover:shadow-md
                  active:scale-95 backdrop-blur-sm border border-transparent hover:border-emerald-200"
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Link
        to="/dashboard/register"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium rounded-lg
          hover:from-emerald-600 hover:to-teal-600 transition-all duration-200
          active:scale-95 shadow-md hover:shadow-lg backdrop-blur-sm"
      >
        Get Started
        <ArrowRight className="w-4 h-4" />
      </Link>
    </header>
  );
}

export default NotelyNav;