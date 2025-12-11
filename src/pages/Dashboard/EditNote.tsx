//EditNote.tsx
import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import SummernoteEditor from "../../components/summerNoteEditor";
import { useState, useEffect } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate, useParams } from "react-router-dom";

const EditNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // Fetch existing note data
  const { data: note, isLoading, isError } = useQuery<NoteData>({
    queryKey: ["get-note", id],
    queryFn: async () => {
      if (!id) throw new Error("Note ID is required");
      const response = await api.get(`/notes/${id}`);
      return response.data.note || response.data.data || response.data;
    },
    enabled: !!id,
  });

  // Populate form with existing data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setSynopsis(note.synopsis);
      setContent(note.content);
    }
  }, [note]);

  const updateNoteMutation = useMutation<any, any, Partial<NoteData>>({
    mutationKey: ["update-note", id],
    mutationFn: async (payload: Partial<NoteData>) => {
      if (!id) throw new Error("Note ID is required");
      console.log("Updating note:", payload);
      const res = await api.patch(`/notes/${id}`, payload);
      console.log("Note update response:", res.data);
      return res.data;
    },
    onSuccess: () => {
      toastUtils.note.updateSuccess("Note updated successfully!");
      navigate(`/dashboard`);
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.note.operationFailed("Updating note", derivedMessage, () => console.log("Retry note update"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !synopsis || !content) {
      toastUtils.auth.validationError("Please fill in all required fields");
      return;
    }

    updateNoteMutation.mutate({
      title,
      synopsis,
      content,
    });
  };

  // Show loading state while fetching note
  if (isLoading) {
    return (
      <DashboardLayout title="Edit Note" subtitle="Loading...">
        <div className="flex justify-center items-center h-[60vh]">
          <MainLoader />
        </div>
      </DashboardLayout>
    );
  }

  // Show error state if note not found
  if (isError || !note) {
    return (
      <DashboardLayout title="Error" subtitle="Note not found">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg font-medium">Note not found or you don't have permission to edit it.</p>
          <button 
            onClick={() => navigate("/dashboard")} 
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Notes
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Note" subtitle="Edit a note">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="bg-card text-card-foreground rounded-2xl border border-border/60 shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Editor</p>
              <h2 className="text-lg font-semibold">Edit note</h2>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="gap-2" type="submit" form="edit-note-form" disabled={updateNoteMutation.isPending}>
                {updateNoteMutation.isPending ? "Updating..." : "Update note"}
              </Button>
            </div>
          </div>

          {/* Form body */}
          <form id="edit-note-form" onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            <div className="space-y-4">
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Building a StoryBook CMS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Keep it concise and keyword rich.</p>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  placeholder="Short description that appears on cards"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                />
              </div>


              {/* Content — Summernote */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <SummernoteEditor
                  value={content}
                  onChange={(val) => setContent(val)}
                />
              </div>

            </div>
          </form>
        </div>

        {updateNoteMutation.isPending && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <MainLoader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditNote;
