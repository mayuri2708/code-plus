
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center">
          <h1 className="text-xl font-bold">Code<span className="text-primary">Plus</span></h1>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container flex flex-col items-center gap-8 py-12 md:flex-row md:py-24">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your coding notes, <span className="text-primary">organized</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Store, organize, and search your programming notes and code snippets in one place.
            </p>
            <ul className="text-muted-foreground space-y-2 pt-4">
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full p-1">✓</span>
                <span>Create notes with syntax highlighting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full p-1">✓</span>
                <span>Organize with tags and language filters</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full p-1">✓</span>
                <span>Search across all your notes</span>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 flex justify-center">
            <AuthForm />
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/40 py-6">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Code-Plus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
