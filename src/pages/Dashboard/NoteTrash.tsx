import DashboardLayout from "./Dashlayout";
import { useState } from "react";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toastUtils } from "../../lib/toast";
import { Button } from "../../components/ui/button";
import { Trash2, Trash, RotateCw, AlertTriangle, Calendar, Clock, Shield, Archive } from "lucide-react";
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
      <DashboardLayout title="Trash" subtitle="Manage deleted notes and restore or permanently delete them">
        <div className="text-center mt-20 p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Trash className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Trash is Empty</h3>
          <p className="text-gray-600 mb-8">Notes you move to trash will appear here</p>
          <Button 
            onClick={() => navigate("/dashboard/notes/new")}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
          >
            <Archive className="w-4 h-4" />
            Create New Note
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
    <DashboardLayout title="Trash" subtitle="Manage deleted notes and restore or permanently delete them">
    
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Trash className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Note Trash
              </h1>
              <p className="text-gray-600 mt-1">Manage deleted notes and restore or permanently delete them</p>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-red-100/50 p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{notes.length}</p>
                <p className="text-sm text-gray-600">Notes in Trash</p>
              </div>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50/80 backdrop-blur-sm rounded-xl border border-yellow-200/50 p-4 mb-8 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Important Notice</h3>
              <p className="text-sm text-yellow-700">Notes in trash will be permanently deleted after 30 days. You can restore them before that time.</p>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <article
              key={note.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-red-100/50 shadow-lg hover:shadow-xl hover:border-red-200/70 transition-all duration-300 hover:-translate-y-1 relative group"
            >
              <div className="absolute top-3 right-3">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                  Deleted
                </span>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(note.dateCreated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {note.lastUpdated !== note.dateCreated && (
                    <span className="ml-2 text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {new Date(note.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold leading-tight line-clamp-2 text-gray-800 group-hover:text-red-600 transition-colors">
                  {note.title}
                </h2>

                {note.user && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    By {note.user.firstName} {note.user.lastName}
                  </p>
                )}

                {note.synopsis && (
                  <p className="text-gray-600 line-clamp-3 text-sm">
                    {note.synopsis}
                  </p>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-red-100/30">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(note.id);
                    }} 
                    disabled={isProcessing === note.id}
                    className="flex-1 border-emerald-200 hover:bg-emerald-50 text-emerald-600"
                  >
                    {isProcessing === note.id ? (
                      <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RotateCw className="w-3 h-3 mr-1" />
                    )}
                    Restore
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    disabled={isProcessing === note.id}
                  >
                    {isProcessing === note.id ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3 mr-1" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Loading overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <MainLoader />
            <p className="mt-4 text-gray-600">Opening note...</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-red-100/50 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">Delete Permanently</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Are you sure you want to permanently delete this note? This action cannot be undone and the note will be lost forever.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setNoteToDelete(null);
              }}
              className="border-gray-200 hover:bg-gray-50 text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isProcessing !== null}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </span>
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-emerald-100/50 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <RotateCw className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">Restore Note</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Are you sure you want to restore this note? It will be moved back to your notes and will no longer be in trash.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setRestoreDialogOpen(false);
                setNoteToRestore(null);
              }}
              className="border-gray-200 hover:bg-gray-50 text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRestore}
              disabled={isProcessing !== null}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Restoring...
                </span>
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