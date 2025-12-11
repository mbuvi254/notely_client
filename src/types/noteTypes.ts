// ==============================
// Note Data
// ==============================
export interface NoteData {
  id: string;
  userId: string;

  title: string;
  synopsis: string;
  content: string;

  isPublic: boolean;
  isDeleted: boolean;

  dateCreated: string;       // matches Prisma: DateTime
  lastUpdated: string;       // always auto-updated by Prisma

  // Optional: Prisma returns the user if included
  user?: NoteAuthor;
}

// ==============================
// Note Author (matches Prisma User model)
// ==============================
export interface NoteAuthor {
  firstName: string;
  lastName: string;
  emailAddress: string;
  username: string;
}

// ==============================
// API Response Types
// ==============================
export interface NoteResponse {
  status: string;
  message: string;

  // Single note
  notes: NoteData;

  // List of user's notes
  userNotes: NoteData[];
}
