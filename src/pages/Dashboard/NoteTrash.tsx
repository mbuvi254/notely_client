import DashboardLayout from "./Dashlayout";
import { useState } from "react";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toastUtils } from "../../lib/toast";
import { Button } from "../../components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

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

export default function NoteTrash() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [noteToRestore, setNoteToRestore] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: notes, isLoading, isError, error } = useQuery<PublicNote[]>({
    queryKey: ["get-trash-notes"],
    queryFn: async () => {
      const response = await api.get("/notes/trash");
   
      return response.data.notes || response.data.data || response.data;
    },
  });

    const handleRestore = async (noteId: string) => {
      setNoteToRestore(noteId);
      setRestoreDialogOpen(true);
    };

    const confirmRestore = async () => {
      if (!noteToRestore) return;

      try {
        setIsProcessing(noteToRestore);
        await api.patch(`/notes/trash/${noteToRestore}/restore`);
        await queryClient.invalidateQueries({ queryKey: ["get-trash-notes"] });
        toastUtils.note.deleteSuccess("Note restored successfully");
      } catch (error) {
        console.error("Error restoring note:", error);
        toastUtils.note.operationFailed("Restoring note", "Failed to restore note. Please try again.");
      } finally {
        setIsProcessing(null);
        setRestoreDialogOpen(false);
        setNoteToRestore(null);
      }
    };

  // const handleNoteClick = (noteId: string) => {
  //   setSelectedNoteId(noteId);
  //   setIsNavigating(true);
    
  //   // Small delay for better UX
  //   setTimeout(() => {
  //     navigate(`/dashboard/notes/trash/${noteId}`);
  //     setIsNavigating(false);
  //   }, 300);
  // };

    const handleDelete = async (noteId: string) => {
      setNoteToDelete(noteId);
      setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
      if (!noteToDelete) return;

      try {
        setIsProcessing(noteToDelete);
        await api.delete(`/notes/${noteToDelete}?permanent=true`);
        await queryClient.invalidateQueries({ queryKey: ["get-trash-notes"] });
        toastUtils.note.deleteSuccess("Note permanently deleted");
      } catch (error) {
        console.error("Error deleting note:", error);
        toastUtils.note.operationFailed("Deleting note", "Failed to delete note. Please try again.");
      } finally {
        setIsProcessing(null);
        setDeleteDialogOpen(false);
        setNoteToDelete(null);
      }
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
      <DashboardLayout>
        <div className="text-center mt-10 p-6">
          <p className="text-muted-foreground text-lg">No notes in trash</p>
          <p className="text-muted-foreground/70 mt-2">
            Notes you move to trash will appear here
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
          <h1 className="text-3xl font-bold">Trash</h1>
          <p className="text-muted-foreground mt-2">Notes you've moved to trash</p>
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
              // onClick={() => handleNoteClick(note.id)}
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

                {/* {note.synopsis && (
                  <p className="text-muted-foreground line-clamp-3">
                    {note.synopsis}
                  </p>
                )} */}

                {/* {note.content && (
                  // <div className="pt-3 border-t border-border/30">
                  //   <p className="text-sm text-muted-foreground/80 line-clamp-4">
                  //       {note.content.substring(0, 200)}...
                  //     </p>
                  //   <p className="text-xs text-primary mt-2 font-medium">
                  //     Click to read more →
                  //   </p>
                  // </div>
                )} */}
              </div>
                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-border/30">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(note.id);
                    }} 
                    disabled={isProcessing === note.id}
                    className="flex-1 gap-1.5"
                  >
                    {isProcessing === note.id ? (
                      <MainLoader />
                    ) : (
                      <RotateCcw className="h-4 w-4" />
                    )}
                    Restore
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    disabled={isProcessing === note.id}
                    className="flex-1 gap-1.5"
                  >
                    {isProcessing === note.id ? (
                      <MainLoader />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Permanently</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setNoteToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isProcessing !== null}
            >
              {isProcessing ? (
                <>
                  <MainLoader />
                  Deleting...
                </>
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this note? It will be moved back to your notes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRestoreDialogOpen(false);
                setNoteToRestore(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRestore}
              disabled={isProcessing !== null}
            >
              {isProcessing ? (
                <>
                  <MainLoader />
                  Restoring...
                </>
              ) : (
                "Restore Note"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
    </>
  );
}