import { Button } from "@/components/ui/button";

type FilterOption = "all" | "MHFA" | "QPR";

interface TrainingFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  currentLanguage?: "en" | "es";
}

export function TrainingFilter({ activeFilter, onFilterChange, currentLanguage = "en" }: TrainingFilterProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <Button
        onClick={() => onFilterChange("MHFA")}
        variant={activeFilter === "MHFA" ? "default" : "outline"}
        className={`
          rounded-full px-6 py-2 font-semibold transition-all
          ${activeFilter === "MHFA" 
            ? "bg-[#003057] hover:bg-[#054a76] text-white border-0" 
            : "bg-white hover:bg-gray-50 text-[#003057] border-2 border-[#003057]"
          }
        `}
      >
        MHFA
      </Button>
      <Button
        onClick={() => onFilterChange("QPR")}
        variant={activeFilter === "QPR" ? "default" : "outline"}
        className={`
          rounded-full px-6 py-2 font-semibold transition-all
          ${activeFilter === "QPR" 
            ? "bg-[#80bc00] hover:bg-[#6ca000] text-white border-0" 
            : "bg-white hover:bg-gray-50 text-[#80bc00] border-2 border-[#80bc00]"
          }
        `}
      >
        QPR
      </Button>
      <Button
        onClick={() => onFilterChange("all")}
        variant={activeFilter === "all" ? "default" : "outline"}
        className={`
          rounded-full px-6 py-2 font-semibold transition-all
          ${activeFilter === "all" 
            ? "bg-gray-800 hover:bg-gray-900 text-white border-0" 
            : "bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300"
          }
        `}
      >
        {currentLanguage === "en" ? "Show All" : "Mostrar Todo"}
      </Button>
    </div>
  );
}