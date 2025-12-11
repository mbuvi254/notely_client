import DashboardLayout from "./Dashlayout";
import { useState, useEffect } from "react";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { toastUtils } from "../../lib/toast";
import useUserStore from "../../Store/userStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";



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
  const [isProcessingNote, setIsProcessingNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [trashDialogOpen, setTrashDialogOpen] = useState(false);
  const [noteToTrash, setNoteToTrash] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { emailAddress, setUser, clearUser } = useUserStore();
  const isLoggedIn = !!emailAddress;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setUser(res.data.data);
      } catch (err) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [setUser, clearUser]);

  const { data: notes, isLoading, isError, error } = useQuery<PublicNote[]>({
    queryKey: ["get-user-notes"],
    queryFn: async () => {
      const response = await api.get("/notes");
      return response.data.notes || response.data.data || response.data;
    },
    enabled: isLoggedIn, // Only run query if user is logged in
  });

  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsNavigating(true);
    
    // Small delay for better UX
    setTimeout(() => {
      navigate(`/dashboard/notes/${noteId}`);
      setIsNavigating(false);
    }, 300);
  };

  const handleEditNote = (noteId: string) => {
    navigate(`/dashboard/notes/${noteId}/edit`);
  };


  const handleTrashNote = async (noteId: string) => {
    setNoteToTrash(noteId);
    setTrashDialogOpen(true);
  };

  const confirmTrashNote = async () => {
    if (!noteToTrash) return;

    try {
      setIsProcessingNote(noteToTrash);
      await api.patch(`/notes/trash/${noteToTrash}`);
      await queryClient.invalidateQueries({ queryKey: ["get-user-notes"] });
      toastUtils.note.deleteSuccess("Note moved to trash");
    } catch (error) {
      console.error("Error trashing note:", error);
      toastUtils.note.operationFailed("Trashing note", "Failed to move note to trash");
    } finally {
      setIsProcessingNote(null);
      setTrashDialogOpen(false);
      setNoteToTrash(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MainLoader />
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate("/dashboard/login");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to access the dashboard</h1>
          <p className="text-muted-foreground">You need to be authenticated to view this content.</p>
        </div>
      </div>
    );
  }

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
       <DashboardLayout>
      <div className="text-center mt-10 p-6">
        <p className="text-muted-foreground text-lg">No notes available</p>
        <p className="text-muted-foreground/70 mt-2">
          When users make their notes public, they'll appear here
        </p>
      </div>
       </DashboardLayout>
    );
  }

  return (
    <>
    <DashboardLayout>
    
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">My Notes</h1>
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
                <div className="pt-3 border-t border-border/30">
                  {/* <p className="text-sm text-muted-foreground/80 line-clamp-4">
                    {note.content.substring(0, 200)}...
                  </p> */}
                  <p className="text-xs text-primary mt-2 font-medium">
                    Click to read more →
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-border/30">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditNote(note.id);
                    }} 
                    disabled={isProcessingNote === note.id}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrashNote(note.id);
                    }}
                    disabled={isProcessingNote === note.id}
                    className="flex-1 gap-1.5"
                  >
                    {isProcessingNote === note.id ? (
                      <MainLoader />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Trash
                  </Button>
                </div>
                
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

      {/* Trash Confirmation Dialog */}
      <Dialog open={trashDialogOpen} onOpenChange={setTrashDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Trash</DialogTitle>
            <DialogDescription>
              Are you sure you want to move this note to trash? You can restore it later from the trash.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTrashDialogOpen(false);
                setNoteToTrash(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmTrashNote}
              disabled={isProcessingNote !== null}
            >
              {isProcessingNote ? (
                <>
                  <MainLoader />
                  Moving...
                </>
              ) : (
                "Move to Trash"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
    </>
  );
}