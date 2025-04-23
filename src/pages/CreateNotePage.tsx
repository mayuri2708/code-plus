
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { NoteForm } from "@/components/notes/NoteForm";
import { useNavigate } from "react-router-dom";

export default function CreateNotePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Note</h1>
          <p className="text-muted-foreground">
            Add a new programming note or code snippet
          </p>
        </div>
        
        <div className="max-w-3xl">
          <NoteForm />
        </div>
      </main>
    </div>
  );
}
