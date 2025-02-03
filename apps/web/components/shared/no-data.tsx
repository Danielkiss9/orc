import { FileQuestion } from 'lucide-react';

export function NoData({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] rounded-lg">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
