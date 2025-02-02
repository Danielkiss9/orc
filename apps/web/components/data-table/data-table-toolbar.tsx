'use client';

import { type Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { Button } from '@orc/web/ui/custom-ui';
import { Input } from '@orc/web/ui/custom-ui';
import { DataTableViewOptions } from './data-table-view-options';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface ToolbarAction {
  icon?: React.ReactNode;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  actions?: ToolbarAction[];
  showViewOptions?: boolean;
  onSearch?: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  placeholder = 'Search...',
  actions = [],
  showViewOptions = true,
  onSearch,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearch?.(value);
  }, 300);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleReset = () => {
    setSearchValue('');
    onSearch?.('');
  };

  return (
    <div className="flex gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {searchValue && (
          <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {actions.map((action, index) => (
          <Button key={index} variant={action.variant ?? 'default'} size="sm" className="h-8" onClick={action.onClick}>
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
        {showViewOptions && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
