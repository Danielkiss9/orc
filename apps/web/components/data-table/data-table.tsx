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
  filterColumn?: string;
  queryKey: string;
  initialData?: TData[];
}

export function DataTable<TData extends Cluster>({ columns, filterColumn = 'name', initialData }: DataTableProps<TData>) {
  const queryClient = useQueryClient();
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
      
  const { data = [], isLoading } = useQuery<TData[]>({
    queryKey: ['clusters'],
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
      onDelete: () => queryClient.invalidateQueries({ queryKey: ['clusters'] }),
    },
  });

  const onClusterConnect = (_: any) => {
    queryClient.invalidateQueries({ queryKey: ['clusters'] });
  };

  return (
    <div className="space-y-4 overflow-hidden bg-card text-card-foreground shadow-sm p-4 border rounded-lg w-full sm:max-w-full">
      <DataTableToolbar table={table} filterColumn={filterColumn} onClusterConnect={onClusterConnect} />
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
            {isLoading ? (
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
