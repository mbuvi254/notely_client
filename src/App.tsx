import { Routes, Route } from "react-router-dom";
import NotelyLayout from "./pages/notely/NotelyLayout";
import NotelyHome from "./pages/notely/NotelyHome";
import Notes from "./pages/notely/Notes";
import ReadNote from "./pages/notely/ReadNote";
import Dashboard from "./pages/Dashboard/Dashboard";
import AuthorRegister from "./pages/Dashboard/AuthorRegister";
import AuthorLogin from "./pages/Dashboard/AuthorLogin";
import AuthorProfile from "./pages/Dashboard/AuthorProfile";
import UpdateProfile from "./pages/Dashboard/UpdateProfile";
import UpdatePassword from "./pages/Dashboard/UpdatePassword";
import ViewNote from "./pages/Dashboard/ViewNote";
import NewNote from "./pages/Dashboard/NewNote";
import NoteTrash from "./pages/Dashboard/NoteTrash";
import PublicNotes from "./pages/Dashboard/PublicNotes";
import EditNote from "./pages/Dashboard/EditNote";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<NotelyHome />} />
        <Route path="/public/notes" element={
          <NotelyLayout title="Public Notes">
            <Notes />
          </NotelyLayout>
        } />
        <Route path="/public/notes/:id" element={<ReadNote />} />

        {/* dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/notes/:id" element={<ViewNote />} />
        <Route path="/dashboard/notes/new" element={<NewNote />} />
        <Route path="/dashboard/notes/:id/edit" element={<EditNote />} />
        <Route path="/dashboard/notes/trash" element={<NoteTrash />} />
        <Route path="/dashboard/notes/privacy" element={<PublicNotes />} />


        <Route path="/dashboard/register" element={<AuthorRegister />} />
        <Route path="/dashboard/login" element={<AuthorLogin />} />
        <Route path="/dashboard/profile" element={<AuthorProfile />} />
        <Route path="/dashboard/profile/update" element={<UpdateProfile />} />
        <Route path="/dashboard/profile/update/password" element={<UpdatePassword />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;