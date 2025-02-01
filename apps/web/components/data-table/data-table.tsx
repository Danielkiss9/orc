'use client';

import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getClusters } from '@orc/web/actions/cluster';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@orc/web/ui/custom-ui';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { Cluster } from '@prisma/client';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  searchableColumns?: string[];
  searchPlaceholder?: string;
  queryKey: string;
  initialData?: TData[];
  toolbarActions?: {
    icon?: React.ReactNode;
    label: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void;
  }[];
  showViewOptions?: boolean;
}

export function DataTable<TData extends Cluster>({
  columns,
  searchableColumns = ['name'],
  searchPlaceholder = 'Search...',
  queryKey,
  initialData,
  toolbarActions = [],
  showViewOptions = true,
}: DataTableProps<TData>) {
  const queryClient = useQueryClient();
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data = [], isLoading } = useQuery<TData[]>({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await getClusters();
      return response.clusters as TData[];
    },
    initialData,
    enabled: !initialData,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      onDelete: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    },
  });

  return (
    <div className="space-y-4 overflow-hidden bg-card text-card-foreground shadow-sm p-4 border rounded-lg w-full sm:max-w-full">
      <DataTableToolbar
        table={table}
        searchableColumns={searchableColumns}
        placeholder={searchPlaceholder}
        actions={toolbarActions}
        showViewOptions={showViewOptions}
      />
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && !initialData ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
