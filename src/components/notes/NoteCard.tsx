
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Note } from "@/contexts/NotesContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export function NoteCard({ note }: { note: Note }) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Truncate description if it's too long
  const truncate = (text: string, length: number) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    <Card className="note-card hover:border-primary/50 cursor-pointer" onClick={() => navigate(`/note/${note.id}`)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">{note.title}</h3>
          {note.language && (
            <Badge variant="outline" className="code-tag">
              {note.language}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 py-2">
        <p className="text-sm text-muted-foreground">
          {truncate(note.description, 100)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex flex-col items-start">
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-secondary px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{note.tags.length - 3} more</span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">Updated {formatDate(note.updatedAt)}</span>
      </CardFooter>
    </Card>
  );
}
