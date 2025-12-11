import DashboardLayout from "./Dashlayout";
import { useState, useEffect } from "react";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toastUtils } from "../../lib/toast";
import { Button } from "../../components/ui/button";
import { Eye, EyeOff, Lock, Unlock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import useUserStore from "../../Store/userStore";

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

export default function PublicNotes() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [noteToTogglePrivacy, setNoteToTogglePrivacy] = useState<string | null>(null);
  const [privacyAction, setPrivacyAction] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(true);
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
    enabled: isLoggedIn,
  });

  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsNavigating(true);
    
    setTimeout(() => {
      navigate(`/dashboard/notes/${noteId}`);
      setIsNavigating(false);
    }, 300);
  };

  const handleEditNote = (noteId: string) => {
    navigate(`/dashboard/notes/${noteId}/edit`);
  };

  const handlePrivacyToggle = (noteId: string, action: 'public' | 'private') => {
    setNoteToTogglePrivacy(noteId);
    setPrivacyAction(action);
    setPrivacyDialogOpen(true);
  };

  const confirmPrivacyToggle = async () => {
    if (!noteToTogglePrivacy) return;

    try {
      setIsProcessing(noteToTogglePrivacy);
      const endpoint = privacyAction === 'public' 
        ? `/notes/${noteToTogglePrivacy}/public`
        : `/notes/${noteToTogglePrivacy}/private`;
      
      await api.patch(endpoint);
      await queryClient.invalidateQueries({ queryKey: ["get-user-notes"] });
      
      const successMessage = privacyAction === 'public' 
        ? "Note made public successfully"
        : "Note made private successfully";
      
      toastUtils.note.deleteSuccess(successMessage);
    } catch (error) {
      console.error("Error toggling privacy:", error);
      const errorMessage = privacyAction === 'public'
        ? "Failed to make note public"
        : "Failed to make note private";
      
      toastUtils.note.operationFailed("Privacy toggle", errorMessage);
    } finally {
      setIsProcessing(null);
      setPrivacyDialogOpen(false);
      setNoteToTogglePrivacy(null);
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
            Create your first note to get started
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const publicNotes = notes.filter(note => note.isPublic);
  const privateNotes = notes.filter(note => !note.isPublic);

  return (
    <>
    <DashboardLayout>
    
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Note Privacy</h1>
          <p className="text-muted-foreground mt-2">Manage which notes are public or private</p>
        </div>

        {/* Public Notes Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Unlock className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">Public Notes ({publicNotes.length})</h2>
          </div>
          
          {publicNotes.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-lg">
              <Eye className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No public notes</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Make notes public to share them with others
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {publicNotes.map((note) => (
                <article
                  key={note.id}
                  className="
                    break-inside-avoid
                    group overflow-hidden rounded-2xl 
                    border border-green-200/70 bg-green-50/30 
                    shadow-sm hover:shadow-lg hover:border-green-300/70 
                    transition-all duration-300 hover:-translate-y-1
                    cursor-pointer relative
                  "
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Public
                    </span>
                  </div>
                  
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

                    <h2 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-green-700 transition-colors">
                      {note.title}
                    </h2>

                    {note.synopsis && (
                      <p className="text-muted-foreground line-clamp-3">
                        {note.synopsis}
                      </p>
                    )}
                    
                    <div className="pt-3 border-t border-green-200/30">
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        Click to read more →
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-green-200/30">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note.id);
                        }} 
                        disabled={isProcessing === note.id}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrivacyToggle(note.id, 'private');
                        }}
                        disabled={isProcessing === note.id}
                        className="flex-1 gap-1.5"
                      >
                        {isProcessing === note.id ? (
                          <MainLoader />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                        Make Private
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Private Notes Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Private Notes ({privateNotes.length})</h2>
          </div>
          
          {privateNotes.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-lg">
              <EyeOff className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No private notes</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                All your notes are currently public
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {privateNotes.map((note) => (
                <article
                  key={note.id}
                  className="
                    break-inside-avoid
                    group overflow-hidden rounded-2xl 
                    border border-border/70 
                    bg-card shadow-sm hover:shadow-lg 
                    hover:border-border 
                    transition-all duration-300 hover:-translate-y-1
                    cursor-pointer relative
                  "
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="absolute top-2 right-2">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                      Private
                    </span>
                  </div>
                  
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

                    {note.synopsis && (
                      <p className="text-muted-foreground line-clamp-3">
                        {note.synopsis}
                      </p>
                    )}
                    
                    <div className="pt-3 border-t border-border/30">
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
                        disabled={isProcessing === note.id}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrivacyToggle(note.id, 'public');
                        }}
                        disabled={isProcessing === note.id}
                        className="flex-1 gap-1.5"
                      >
                        {isProcessing === note.id ? (
                          <MainLoader />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        Make Public
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
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

      {/* Privacy Toggle Confirmation Dialog */}
      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {privacyAction === 'public' ? 'Make Note Public' : 'Make Note Private'}
            </DialogTitle>
            <DialogDescription>
              {privacyAction === 'public' 
                ? 'Are you sure you want to make this note public? Anyone will be able to see and read this note.'
                : 'Are you sure you want to make this note private? Only you will be able to see this note.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPrivacyDialogOpen(false);
                setNoteToTogglePrivacy(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPrivacyToggle}
              disabled={isProcessing !== null}
              variant={privacyAction === 'public' ? 'default' : 'secondary'}
            >
              {isProcessing ? (
                <>
                  <MainLoader />
                  {privacyAction === 'public' ? 'Making Public...' : 'Making Private...'}
                </>
              ) : (
                privacyAction === 'public' ? 'Make Public' : 'Make Private'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
    </>
  );
}
