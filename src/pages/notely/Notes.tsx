import { useState } from "react";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import publicApi from "../../lib/publicApi";
import { useQuery } from "@tanstack/react-query";

// Define a proper interface for the API response
interface PublicNote {
  id: string;
  userId: string;
  title: string;
  synopsis: string;
  content: string;
  isPublic: boolean;
  dateCreated: string;
  lastUpdated: string;
  isDeleted: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
}

export default function Notes() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const { data: notes, isLoading, isError, error } = useQuery<PublicNote[]>({
    queryKey: ["get-public-notes"],
    queryFn: async () => {
      const response = await publicApi.get("/public/notes");
      // Adjust based on your actual API response structure
      return response.data.notes || response.data.data || response.data;
    },
  });

  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsNavigating(true);
    
    // Small delay for better UX
    setTimeout(() => {
      navigate(`/public/notes/${noteId}`);
      setIsNavigating(false);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <MainLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 p-6">
        <p className="text-red-500 font-medium">
          Error loading notes: {(error as Error).message}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-center mt-10 p-6">
        <p className="text-muted-foreground text-lg">No public notes available</p>
        <p className="text-muted-foreground/70 mt-2">
          When users make their notes public, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Public Notes</h1>
          <p className="text-muted-foreground mt-2">
            Browse notes shared by the community
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {notes.map((note) => (
            <article
              key={note.id}
              className="
                break-inside-avoid
                group overflow-hidden rounded-2xl 
                border border-border/70 
                bg-card shadow-sm hover:shadow-lg 
                hover:border-border 
                transition-all duration-300 hover:-translate-y-1
                cursor-pointer
                relative
              "
              onClick={() => handleNoteClick(note.id)}
            >
              {/* Optional: Public badge */}
              {note.isPublic && (
                <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Public
                </div>
              )}
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {new Date(note.dateCreated).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    {note.lastUpdated !== note.dateCreated && (
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Updated {new Date(note.lastUpdated).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {note.title}
                </h2>

                {note.user && (
                  <p className="text-sm text-muted-foreground mt-2">
                    By {note.user.firstName} {note.user.lastName}
                  </p>
                )}

                {note.synopsis && (
                  <p className="text-muted-foreground line-clamp-3">
                    {note.synopsis}
                  </p>
                )}

                {/* Preview of content */}
                {note.content && (
                  <div className="pt-3 border-t border-border/30">
                    {/* <p className="text-sm text-muted-foreground/80 line-clamp-4">
                      {note.content.substring(0, 200)}...
                    </p> */}
                    <p className="text-xs text-primary mt-2 font-medium">
                      Click to read more →
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Loading overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <MainLoader />
            <p className="mt-4 text-muted-foreground">
              Opening note...
            </p>
          </div>
        </div>
      )}
    </>
  );
}