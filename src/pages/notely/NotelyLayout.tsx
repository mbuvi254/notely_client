import type { ReactNode } from "react";
import NotelyNav from "./NotelyNav";
import NotelyFooter from "./NotelyFooter";

interface NotelyLayoutProps {
  title?: string;
  children?: ReactNode;
}

const NotelyLayout = ({
  title = "Notely",
  children,
}: NotelyLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      <div className="flex-1 w-full px-4 py-6 max-w-7xl mx-auto">
        <NotelyNav />

        <main className="mt-8 space-y-8">
          {title !== "Notely" && (
            <header className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            </header>
          )}

          {/* Always show children if provided, otherwise show fallback */}
          {children || (
            <section className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-emerald-100/50 transform transition-all hover:shadow-xl hover:-translate-y-0.5">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Notely</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Start creating beautiful notes and organize your thoughts in a sleek way.
                </p>
                <div className="mt-6">
                  <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg">
                    Create New Note
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <NotelyFooter />
    </div>
  );
};

export default NotelyLayout;