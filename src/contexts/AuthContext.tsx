
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // For demo purposes, we'll use localStorage
  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      if (users.some((u: User) => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password, // In a real app, this would be hashed
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Log the user in after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
