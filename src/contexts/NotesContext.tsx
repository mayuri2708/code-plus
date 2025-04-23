
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

export type Note = {
  id: string;
  userId: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, note: Partial<Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">>) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
  searchNotes: (query: string) => Note[];
  filterNotesByLanguage: (language: string) => Note[];
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load notes from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedNotes = localStorage.getItem(`notes-${user.id}`);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes([]);
      }
    } else {
      setNotes([]);
    }
  }, [user]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notes-${user.id}`, JSON.stringify(notes));
    }
  }, [notes, user]);

  const addNote = (note: Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return;
    
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes((prevNotes) => [...prevNotes, newNote]);
    toast({
      title: "Note created",
      description: "Your note has been saved",
    });
  };

  const updateNote = (id: string, noteUpdate: Partial<Omit<Note, "id" | "userId" | "createdAt" | "updatedAt">>) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              ...noteUpdate, 
              updatedAt: new Date().toISOString() 
            } 
          : note
      )
    );
    toast({
      title: "Note updated",
      description: "Your changes have been saved",
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Your note has been removed",
    });
  };

  const getNote = (id: string) => {
    return notes.find((note) => note.id === id);
  };

  const searchNotes = (query: string) => {
    if (!query.trim()) return notes;
    
    const lowerCaseQuery = query.toLowerCase();
    return notes.filter(
      (note) => 
        note.title.toLowerCase().includes(lowerCaseQuery) || 
        note.description.toLowerCase().includes(lowerCaseQuery) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const filterNotesByLanguage = (language: string) => {
    if (!language || language === "all") return notes;
    return notes.filter((note) => note.language === language);
  };

  return (
    <NotesContext.Provider 
      value={{ 
        notes, 
        addNote, 
        updateNote, 
        deleteNote, 
        getNote, 
        searchNotes, 
        filterNotesByLanguage 
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
