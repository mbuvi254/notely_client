import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NoteLayout from "./NotelyLayout";
import MainLoader from "../../components/common/MainLoader";
import api from "../../lib/api";
import publicApi from "../../lib/publicApi";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "../../Store/userStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";


interface NoteData {
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

const ReadNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { id: userId, setUser, clearUser } = useUserStore();
  const [isOwner, setIsOwner] = useState(false);

  // Fetch note data
  const { data: note, isLoading, isError, error } = useQuery<NoteData>({
    queryKey: ["get-note", id],
    queryFn: async () => {
      if (!id) throw new Error("Note ID is required");
      
      try {
        // Try authenticated access first
        const response = await api.get(`/notes/${id}`);
        return response.data.note || response.data.data || response.data;
      } catch (authError) {
        // If authenticated access fails, try public access
        const publicResponse = await publicApi.get(`public/notes/${id}`);
        return publicResponse.data.note || publicResponse.data.data || publicResponse.data;
      }
    },
    enabled: !!id,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setUser(res.data.data);
      } catch {
        clearUser();
      }
    };
    checkAuthStatus();
  }, [setUser, clearUser]);

  // Check if current user is the note owner
  useEffect(() => {
    if (note && userId) {
      setIsOwner(note.userId === userId);
    } else {
      setIsOwner(false);
    }
  }, [note, userId]);

  if (isLoading) return <MainLoaderWrapper />;
  
  if (isError) {
    const errorMessage = (error as any)?.response?.status === 403 
      ? "You don't have permission to view this note"
      : (error as any)?.response?.status === 404
      ? "Note not found"
      : (error as Error).message || "Failed to load note";
      
    return (
      <ErrorWrapper 
        navigate={navigate} 
        message={errorMessage} 
      />
    );
  }
  
  if (!note) return <ErrorWrapper navigate={navigate} message="Note not found." />;

  return (
    <NoteLayout 
      // title={note.title} 
      // subtitle={note.synopsis || "A shared note"}
    >
      <div className="space-y-10 max-w-4xl mx-auto">
        <BackButton navigate={navigate} />
        
        <NoteContent note={note} isOwner={isOwner} />
        
      </div>
    </NoteLayout>
  );
};

export default ReadNote;

// Helper Components
const MainLoaderWrapper = () => (
  <div className="h-[60vh] flex justify-center items-center">
    <MainLoader />
  </div>
);

const ErrorWrapper = ({ navigate, message }: { navigate: any; message: string }) => (
  <NoteLayout title="Error">
    <div className="text-center py-12">
      <p className="text-red-500 text-lg font-medium">{message}</p>
      <button 
        onClick={() => navigate(-1)} 
        className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Go Back
      </button>
    </div>
  </NoteLayout>
);

const BackButton = ({ navigate }: { navigate: any }) => (
  <button
    onClick={() => navigate(-1)}
    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
  >
    <svg 
      className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    Back to notes
  </button>
);

interface NoteContentProps {
  note: NoteData;
  isOwner: boolean;
}

const NoteContent = ({ note, isOwner }: NoteContentProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
            {note.synopsis && (
              <p className="text-lg text-muted-foreground mt-2">{note.synopsis}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {note.isPublic && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Public
              </span>
            )}
            {isOwner && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Your Note
              </span>
            )}
          </div>
        </div>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Created: {formatDate(note.dateCreated)}</span>
          </div>
          
          {note.lastUpdated !== note.dateCreated && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Updated: {formatDate(note.lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {/* <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap leading-relaxed p-2">
          {note.content}
        </div>
      </div> */}
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
        >
          {note.content}
        </ReactMarkdown>
    </div>
  );
};