import DashboardLayout from "./Dashlayout";
import { useState, useEffect } from "react";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { RotateCcw, Trash2, Edit3, Calendar, RefreshCw, FileText, Plus } from "lucide-react";
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
      <DashboardLayout title="Error" subtitle="Something went wrong">
        <div className="text-center py-12">
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
      </DashboardLayout>
    );
  }

  if (!notes || notes.length === 0) {
    return (
       <DashboardLayout title="My Notes" subtitle="Create and manage your personal notes">
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-6">
          <FileText className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">No notes yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Start creating your first note to organize your thoughts and ideas
        </p>
        <Button 
          onClick={() => navigate('/dashboard/notes/new')}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Note
        </Button>
      </div>
       </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Notes" subtitle="Create and manage your personal notes">
      {/* Quick Actions Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {notes?.length || 0} {notes?.length === 1 ? 'Note' : 'Notes'}
              </h3>
              <p className="text-sm text-gray-600">Your personal collection</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/notes/new')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
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

              {/* Synopsis */}
              {note.synopsis && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {note.synopsis.length > 120 ? `${note.synopsis.substring(0, 120)}...` : note.synopsis}
                </p>
              )}

              {/* Content preview */}
              <div className="pt-3 border-t border-emerald-100/30">
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  Click to read more
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-emerald-100/30">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditNote(note.id);
                  }} 
                  disabled={isProcessingNote === note.id}
                  className="flex-1 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrashNote(note.id);
                  }}
                  disabled={isProcessingNote === note.id}
                  className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 hover:text-red-700"
                >
                  {isProcessingNote === note.id ? (
                    <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  Trash
                </Button>
              </div>
            </div>
          </article>
        ))}
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
        <DialogContent className="bg-white/95 backdrop-blur-sm border border-emerald-100/50">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-800">Move to Trash</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Are you sure you want to move this note to trash? You can restore it later from the trash section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setTrashDialogOpen(false);
                setNoteToTrash(null);
              }}
              className="border-emerald-200 hover:bg-emerald-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmTrashNote}
              disabled={isProcessingNote !== null}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isProcessingNote ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Moving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Move to Trash
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}