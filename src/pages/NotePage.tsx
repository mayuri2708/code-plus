
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NoteForm } from "@/components/notes/NoteForm";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function NotePage() {
  const { noteId } = useParams<{ noteId: string }>();
  const { isAuthenticated } = useAuth();
  const { getNote, deleteNote } = useNotes();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const note = noteId ? getNote(noteId) : undefined;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    
    if (noteId && !note) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, noteId, note, navigate]);
  
  if (!note) {
    return null; // Don't render anything if note not found
  }
  
  const handleDelete = () => {
    deleteNote(note.id);
    navigate("/dashboard");
  };
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 md:py-8">
        {isEditing ? (
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Edit Note</h1>
            <NoteForm 
              initialData={note} 
              onSubmit={() => setIsEditing(false)} 
            />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Dashboard
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-bold">{note.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {note.language && (
                    <Badge variant="outline">{note.language}</Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Updated {formatDate(note.updatedAt)}
                  </span>
                </div>
              </div>
              
              {note.description && (
                <div className="bg-card p-4 rounded-lg border">
                  <p className="whitespace-pre-line">{note.description}</p>
                </div>
              )}
              
              {note.code && (
                <div>
                  <h3 className="text-md font-medium mb-2">Code Snippet</h3>
                  <pre className="codeblock whitespace-pre-wrap">{note.code}</pre>
                </div>
              )}
              
              {note.tags.length > 0 && (
                <div>
                  <h3 className="text-md font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="text-sm bg-secondary px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
