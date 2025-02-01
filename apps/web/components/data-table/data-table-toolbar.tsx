'use client';

import { useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { X, Plus } from 'lucide-react';

import { Button } from '@orc/web/ui/custom-ui';
import { Input } from '@orc/web/ui/custom-ui';
import { DataTableViewOptions } from './data-table-view-options';
import { ClusterConnectModal } from '@orc/web/components/modals/cluster-connect-modal';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumn: string;
  onClusterConnect: (clusterData: any) => void
}

export function DataTableToolbar<TData>({ table, filterColumn, onClusterConnect }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <div className="flex gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${filterColumn}...`}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="default" size="sm" className="h-8" onClick={() => setIsImportModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Import Cluster
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      <ClusterConnectModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onConnectSuccess={onClusterConnect} />
    </div>
  );
}
