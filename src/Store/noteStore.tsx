// File: store/useNoteStore.ts
import { type StateCreator, create } from 'zustand'

interface NoteFormData {
    id: string;
    title: string;
    synopsis: string;
    content: string;
    isPublic: boolean;
    userId?: string;
}

interface NoteStoreType {
    // Form state for editing
    noteForm: NoteFormData;
    
    // Current note ID
    currentNoteId: string;
    
    // Actions
    setNoteForm: (form: NoteFormData) => void;
    updateNoteForm: (updates: Partial<NoteFormData>) => void;
    setCurrentNoteId: (id: string) => void;
    resetNoteForm: () => void;
}

const initialNoteForm: NoteFormData = {
    id: "",
    title: "",
    synopsis: "",
    content: "",
    isPublic: false,
};

const noteStore: StateCreator<NoteStoreType> = (set) => ({
    noteForm: initialNoteForm,
    currentNoteId: "",
    
    setNoteForm: (noteForm) => set({ noteForm }),
    
    updateNoteForm: (updates) => set((state) => ({
        noteForm: { ...state.noteForm, ...updates }
    })),
    
    setCurrentNoteId: (currentNoteId) => set({ currentNoteId }),
    
    resetNoteForm: () => set({ 
        noteForm: initialNoteForm,
        currentNoteId: "" 
    }),
});

const useNoteStore = create(noteStore);
export default useNoteStore;