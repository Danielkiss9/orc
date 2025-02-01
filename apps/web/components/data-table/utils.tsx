import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@orc/web/ui/custom-ui";

export const SortButton = ({ column, children }: { column: any; children: React.ReactNode }) => {
  const isSorted = column.getIsSorted();

  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(isSorted === 'asc')} className="group hover:bg-transparent px-0">
      {children}
      <div className="ml-2">
        {isSorted === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : isSorted === 'desc' ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50 group-hover:opacity-100" />
        )}
      </div>
    </Button>
  );
};
