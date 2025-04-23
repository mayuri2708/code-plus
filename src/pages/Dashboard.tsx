
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes, Note } from "@/contexts/NotesContext";
import { Header } from "@/components/layout/Header";
import { NoteCard } from "@/components/notes/NoteCard";
import { SearchBar } from "@/components/notes/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const { notes, searchNotes, filterNotesByLanguage } = useNotes();
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const navigate = useNavigate();

  // Get unique languages from all notes
  const uniqueLanguages = Array.from(
    new Set(notes.map((note) => note.language).filter(Boolean))
  ) as string[];

  // Effect to handle search and filtering
  useEffect(() => {
    let result = notes;
    
    if (searchQuery) {
      result = searchNotes(searchQuery);
    }
    
    if (languageFilter !== "all") {
      result = result.filter((note) => note.language === languageFilter);
    }
    
    setFilteredNotes(result);
  }, [notes, searchQuery, languageFilter, searchNotes]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLanguageFilter = (language: string) => {
    setLanguageFilter(language);
  };

  if (!user) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
            <p className="text-muted-foreground">
              Manage your programming notes and code snippets
            </p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate("/new-note")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
        
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            onLanguageFilter={handleLanguageFilter}
            languages={uniqueLanguages}
          />
        </div>
        
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-muted-foreground mb-4">
              {notes.length === 0 
                ? "Start by creating your first note" 
                : "Try changing your search or filter"}
            </p>
            {notes.length === 0 && (
              <Button onClick={() => navigate("/new-note")}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
