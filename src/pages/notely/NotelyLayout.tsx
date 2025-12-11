import type { ReactNode } from "react";
import NotelyNav from "./NotelyNav";
import NotelyFooter from "./NotelyFooter";

type NotelyLayoutProps = {
  title?: string;
  children?: ReactNode;
};

const NotelyLayout = ({
  title = "Notely",
  children,
}: NotelyLayoutProps) => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <div className="flex-1 w-full px-4 py-6">
        <NotelyNav />

        <main className="mt-10 space-y-6">
          <header className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              {title === "Notely" ? "Notely Dashboard" : title}
            </p>
          </header>

          {/* Always show children if provided, otherwise show fallback */}
          {children || (
            <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Manage your notes and documents from here.
              </p>
            </section>
          )}
        </main>
      </div>

      <NotelyFooter />
    </div>
  );
};

export default NotelyLayout;