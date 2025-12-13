import DashboardLayout from "./Dashlayout";
import { useState, useEffect } from "react";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate } from "react-router-dom";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toastUtils } from "../../lib/toast";
import { Button } from "../../components/ui/button";
import { Eye, EyeOff, Lock, Globe, Shield, Edit, Plus, Activity, Calendar } from "lucide-react";
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
      <DashboardLayout title="Note Privacy" subtitle="Manage which notes are public or private">
        <div className="text-center mt-20 p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Notes Yet</h3>
          <p className="text-gray-600 mb-8">Create your first note to get started with managing privacy settings</p>
          <Button 
            onClick={() => navigate("/dashboard/notes/new")}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Note
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const publicNotes = notes.filter(note => note.isPublic);
  const privateNotes = notes.filter(note => !note.isPublic);

  return (
    <>
    <DashboardLayout title="Note Privacy" subtitle="Manage which notes are public or private">
    
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Note Privacy Management
              </h1>
              <p className="text-gray-600 mt-1">Control the visibility of your notes</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100/50 p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{publicNotes.length}</p>
                  <p className="text-sm text-gray-600">Public Notes</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600">{privateNotes.length}</p>
                  <p className="text-sm text-gray-600">Private Notes</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100/50 p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{notes.length}</p>
                  <p className="text-sm text-gray-600">Total Notes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Notes Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Public Notes ({publicNotes.length})</h2>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          
          {publicNotes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-12 text-center shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Public Notes</h3>
              <p className="text-gray-600 mb-6">Make notes public to share them with others</p>
              <Button 
                onClick={() => navigate("/dashboard/notes/new")}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Note
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicNotes.map((note) => (
                <article
                  key={note.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-lg hover:shadow-xl hover:border-emerald-200/70 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group"
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                      Public
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
                        <span className="ml-2 text-gray-400">
                          • Updated {new Date(note.lastUpdated).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold leading-tight line-clamp-2 text-gray-800 group-hover:text-emerald-600 transition-colors">
                      {note.title}
                    </h2>

                    {note.synopsis && (
                      <p className="text-gray-600 line-clamp-3 text-sm">
                        {note.synopsis}
                      </p>
                    )}
                    
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
                        disabled={isProcessing === note.id}
                        className="flex-1 border-emerald-200 hover:bg-emerald-50 text-emerald-600"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrivacyToggle(note.id, 'private');
                        }}
                        disabled={isProcessing === note.id}
                        className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-600"
                      >
                        {isProcessing === note.id ? (
                          <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <EyeOff className="w-3 h-3 mr-1" />
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Private Notes ({privateNotes.length})</h2>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          
          {privateNotes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 text-center shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Private Notes</h3>
              <p className="text-gray-600 mb-6">All your notes are currently public</p>
              <Button 
                onClick={() => navigate("/dashboard/notes/new")}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Note
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {privateNotes.map((note) => (
                <article
                  key={note.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl hover:border-gray-300/70 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative group"
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                      Private
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
                        <span className="ml-2 text-gray-400">
                          • Updated {new Date(note.lastUpdated).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold leading-tight line-clamp-2 text-gray-800 group-hover:text-gray-600 transition-colors">
                      {note.title}
                    </h2>

                    {note.synopsis && (
                      <p className="text-gray-600 line-clamp-3 text-sm">
                        {note.synopsis}
                      </p>
                    )}
                    
                    <div className="pt-3 border-t border-gray-200/30">
                      <p className="text-xs text-gray-600 font-medium flex items-center gap-1">
                        Click to read more
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200/30">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note.id);
                        }} 
                        disabled={isProcessing === note.id}
                        className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-600"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrivacyToggle(note.id, 'public');
                        }}
                        disabled={isProcessing === note.id}
                      >
                        {isProcessing === note.id ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Make Public
                          </>
                        )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <MainLoader />
            <p className="mt-4 text-gray-600">Opening note...</p>
          </div>
        </div>
      )}

      {/* Privacy Toggle Confirmation Dialog */}
      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-emerald-100/50 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                privacyAction === 'public' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600'
              }`}>
                {privacyAction === 'public' ? (
                  <Globe className="w-5 h-5 text-white" />
                ) : (
                  <Lock className="w-5 h-5 text-white" />
                )}
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {privacyAction === 'public' ? 'Make Note Public' : 'Make Note Private'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              {privacyAction === 'public' 
                ? 'Are you sure you want to make this note public? Anyone will be able to see and read this note.'
                : 'Are you sure you want to make this note private? Only you will be able to see this note.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setPrivacyDialogOpen(false);
                setNoteToTogglePrivacy(null);
              }}
              className="border-gray-200 hover:bg-gray-50 text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPrivacyToggle}
              disabled={isProcessing !== null}
              className={privacyAction === 'public' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200'
                : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
              }
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {privacyAction === 'public' ? 'Making Public...' : 'Making Private...'}
                </span>
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
