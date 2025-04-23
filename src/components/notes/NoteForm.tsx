
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNotes, Note } from "@/contexts/NotesContext";
import { useNavigate } from "react-router-dom";

type NoteFormProps = {
  initialData?: Partial<Note>;
  onSubmit?: () => void;
};

const LANGUAGES = [
  "JavaScript", 
  "TypeScript", 
  "Python", 
  "Java", 
  "C#", 
  "PHP", 
  "Ruby", 
  "Go", 
  "Swift", 
  "Kotlin",
  "Rust", 
  "C++", 
  "C", 
  "HTML", 
  "CSS", 
  "SQL", 
  "Other"
];

export function NoteForm({ initialData, onSubmit }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [code, setCode] = useState(initialData?.code || "");
  const [language, setLanguage] = useState(initialData?.language || "");
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");
  
  const { addNote, updateNote } = useNotes();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags from comma-separated string
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    
    if (!title) {
      toast({
        title: "Title required",
        description: "Please provide a title for your note",
        variant: "destructive",
      });
      return;
    }
    
    if (initialData?.id) {
      // Update existing note
      updateNote(initialData.id, {
        title,
        description,
        code,
        language,
        tags,
      });
    } else {
      // Add new note
      addNote({
        title,
        description,
        code,
        language,
        tags,
      });
    }
    
    if (onSubmit) {
      onSubmit();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          placeholder="Enter note title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="What is this code about?" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="code">Code Snippet</Label>
        <Textarea 
          id="code" 
          placeholder="Paste your code here" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-editor font-mono min-h-[150px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">Programming Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input 
            id="tags" 
            placeholder="react, hooks, tutorial" 
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button type="submit">
          {initialData?.id ? "Update Note" : "Save Note"}
        </Button>
      </div>
    </form>
  );
}
