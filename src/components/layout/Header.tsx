
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 
            className="text-xl font-bold cursor-pointer" 
            onClick={() => navigate("/dashboard")}
          >
            Code<span className="text-primary">Plus</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => navigate("/new-note")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="md:hidden"
                onClick={() => navigate("/new-note")}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
