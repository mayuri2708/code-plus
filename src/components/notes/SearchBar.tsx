
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  onLanguageFilter: (language: string) => void;
  languages: string[];
};

export function SearchBar({ onSearch, onLanguageFilter, languages }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search notes by title, description or tags"
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>
      <Select onValueChange={onLanguageFilter} defaultValue="all">
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          {languages.map((language) => (
            <SelectItem key={language} value={language}>
              {language}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
