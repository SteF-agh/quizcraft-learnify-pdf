import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

export const TableFilters = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange
}: TableFiltersProps) => {
  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Dokumente durchsuchen..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <Select value={filterStatus} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter nach Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Dokumente</SelectItem>
          <SelectItem value="with-questions">Mit Fragen</SelectItem>
          <SelectItem value="without-questions">Ohne Fragen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};