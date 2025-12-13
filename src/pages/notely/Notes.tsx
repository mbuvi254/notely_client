import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import publicApi from "../../lib/publicApi";
import { useQuery } from "@tanstack/react-query";
import { User, Globe, Calendar, RefreshCw } from "lucide-react";


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

  const { data: notes, isLoading, isError, error } = useQuery<PublicNote[]>({
    queryKey: ["get-public-notes"],
    queryFn: async () => {
      const response = await publicApi.get("/public/notes");
     
      return response.data.notes || response.data.data || response.data;
    },
  });

  const handleNoteClick = (noteId: string) => {
    setIsNavigating(true);
    

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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-4">
          Error loading notes: {(error as Error).message}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
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
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {notes.map((note) => (
            <article
              key={note.id}
              className="
                break-inside-avoid
                group overflow-hidden rounded-2xl 
                border border-emerald-100/50 
                bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl 
                hover:border-emerald-200/70 
                transition-all duration-300 hover:-translate-y-1
                cursor-pointer
                relative
              "
              onClick={() => handleNoteClick(note.id)}
            >
              {/* Public badge */}
              {note.isPublic && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200">
                  <Globe className="w-3 h-3" />
                  Public
                </div>
              )}
              
              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Date and metadata */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3 text-emerald-500" />
                  <span>
                    {new Date(note.dateCreated).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  {note.lastUpdated !== note.dateCreated && (
                    <span className="flex items-center gap-1 text-gray-400">
                      <RefreshCw className="w-3 h-3" />
                      Updated
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold leading-tight line-clamp-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-teal-700 transition-all duration-200">
                  {note.title}
                </h2>

                {/* Author info */}
                {note.user && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center text-white text-sm font-medium">
                      {note.user.firstName[0]}{note.user.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {note.user.firstName} {note.user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Author
                      </p>
                    </div>
                    <User className="w-4 h-4 text-emerald-500" />
                  </div>
                )}

                {/* Synopsis */}
                {note.synopsis && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                    {note.synopsis.length > 120 ? `${note.synopsis.substring(0, 120)}...` : note.synopsis}
                  </p>
                )}

                {/* Content preview */}
                {note.content && (
                  <div className="pt-3 border-t border-emerald-100/30">
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      Click to read more
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
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