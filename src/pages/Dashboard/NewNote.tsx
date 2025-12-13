import DashboardLayout from "./Dashlayout";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import SummernoteEditor from "../../components/summerNoteEditor";
import { useState } from "react";
import MainLoader from "../../components/common/MainLoader";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";
import { toastUtils } from "../../lib/toast";
import { type NoteData } from "../../types/noteTypes";
import { useNavigate } from "react-router-dom";
import { FileText, Save, ArrowLeft, Eye, Lock, Globe } from "lucide-react";

const NewNote = () => {
  const [title, setTitle] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);


  const navigate = useNavigate();

  const newNoteMutation = useMutation<any, any, Partial<NoteData>>({
    mutationKey: ["new-note-key"],
    mutationFn: async (payload: Partial<NoteData>) => {
      console.log("Creating new note:", payload);
      const res = await api.post("/notes", payload);
      console.log("Note creation response:", res.data);
      return res.data;
    },
    onSuccess: () => {
      setTitle("");
      setSynopsis("");
      setContent("");
      toastUtils.note.createSuccess("Note created successfully!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      toastUtils.note.operationFailed("Creating note", derivedMessage, () => console.log("Retry note creation"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !synopsis || !content) {
      toastUtils.auth.validationError("Please fill in all required fields");
      return;
    }

    newNoteMutation.mutate({
      title,
      synopsis,
      content,
      isPublic,
      isDeleted: false,
    });
  };

  return (
    <DashboardLayout title="Create New Note" subtitle="Compose and organize your thoughts">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        {/* Main Editor */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100/50 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Editor</p>
                <h2 className="text-lg font-semibold text-gray-800">Compose your note</h2>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="border-emerald-200 hover:bg-emerald-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                type="submit" 
                form="new-note-form" 
                disabled={newNoteMutation.isPending}
              >
                {newNoteMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Create Note
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Form body */}
          <form id="new-note-form" onSubmit={handleSubmit} className="space-y-8 px-8 py-8">
            <div className="space-y-6">
              
              {/* Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Building a StoryBook CMS"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 text-lg"
                />
                <p className="text-xs text-gray-500">Keep it concise and keyword rich for better discoverability.</p>
              </div>

              {/* Synopsis */}
              <div className="space-y-3">
                <Label htmlFor="synopsis" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  Synopsis
                </Label>
                <Textarea
                  id="synopsis"
                  placeholder="Short description that appears on note cards (max 120 characters)"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  {synopsis.length}/120 characters - This appears in note previews
                </p>
              </div>

              {/* Privacy Toggle */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Privacy Settings</Label>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isPublic ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <div className="flex items-center gap-2">
                    {isPublic ? (
                      <>
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-gray-700">Public - Anyone can view</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Private - Only you can view</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content — Summernote */}
              <div className="space-y-3">
                <Label htmlFor="content" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Content
                </Label>
                <div className={`border ${isFullscreen ? 'border-transparent' : 'border-emerald-200'} ${isFullscreen ? 'rounded-none' : 'rounded-lg'} overflow-hidden transition-all duration-200`}>
                  <SummernoteEditor
                    value={content}
                    onChange={(val) => setContent(val)}
                    onFullscreen={(fullscreen) => setIsFullscreen(fullscreen)}
                    height={400}
                  />
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Writing Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use a descriptive title that captures the essence of your note</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Keep your synopsis concise and engaging</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use markdown formatting for better structure</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Consider making notes public for sharing knowledge</span>
              </li>
            </ul>
          </div>

          {/* Character Count */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Note Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Title characters</span>
                <span className="text-sm font-medium text-emerald-600">{title.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Synopsis characters</span>
                <span className={`text-sm font-medium ${synopsis.length > 120 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {synopsis.length}/120
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Content words</span>
                <span className="text-sm font-medium text-emerald-600">{content.split(/\s+/).filter(word => word.length > 0).length}</span>
              </div>
            </div>
          </div>
        </div>

        {newNoteMutation.isPending && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <MainLoader />
              <p className="mt-4 text-gray-600">Creating your note...</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewNote;
