import { Button } from "@/components/ui/button";
import { TrainingType } from "@/lib/types";

type FilterOption = TrainingType | "Both";

interface TrainingFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

export function TrainingFilter({ activeFilter, onFilterChange }: TrainingFilterProps) {
  const filters: FilterOption[] = ["MHFA", "QPR", "Both"];
  
  return (
    <div className="flex justify-center gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          onClick={() => onFilterChange(filter)}
          size="sm"
        >
          {filter === "Both" ? "Show All" : filter}
        </Button>
      ))}
    </div>
  );
}