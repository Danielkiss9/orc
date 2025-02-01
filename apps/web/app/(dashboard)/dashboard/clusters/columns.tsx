'use client';

import { CellContext, ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@orc/web/ui/custom-ui';
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { deleteCluster } from '@orc/web/actions/cluster/delete';
import { DeleteClusterModal } from '@orc/web/components/modals/cluster-delete-modal';
import { Cluster, OrphanedResource } from '@prisma/client';
import { GetAllClustersResponse } from './page';

const SortButton = ({ column, children }: { column: any; children: React.ReactNode }) => {
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

export const columns: ColumnDef<GetAllClustersResponse>[] = [
  {
    accessorKey: 'name',
    header: 'Cluster',
  },
  {
    accessorKey: 'version',
    header: ({ column }) => <SortButton column={column}>K8s Version</SortButton>,
  },
  {
    accessorKey: 'nodes',
    header: 'Nodes',
  },
  {
    accessorKey: 'orphansResources',
    meta: {
      title: 'Orphan Resources',
    },
    header: ({ column }) => <SortButton column={column}>Orphan Resources</SortButton>,
    cell: ({ row }) => {
      const { status, _count } = row.original;

      if (status === 'PENDING' || _count.orphanedResources === null) {
        return 'N/A';
      }

      return (
        <div className="flex items-center">
          {_count.orphanedResources > 0 ? <Badge variant="error">{_count.orphanedResources}</Badge> : <Badge variant="success">0</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: 'score',
    header: ({ column }) => <SortButton column={column}>Score</SortButton>,
    cell: ({ row }) => {
      if (row.original.score === null) {
        return 'N/A';
      }

      const score = row.original.score;
      const variant = score > 80 ? 'success' : score > 50 ? 'warning' : 'error';

      return (
        <div className="flex items-center">
          <Badge variant={variant}>{score}</Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: (props: CellContext<GetAllClustersResponse, unknown>) => {
      const [showDeleteModal, setShowDeleteModal] = useState(false);

      const handleDelete = async () => {
        await deleteCluster(props.row.original.id);
        (props.table.options.meta as any).onDelete();
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteModal(true)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteClusterModal
            isOpen={showDeleteModal}
            clusterName={props.row.original.name}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
          />
        </>
      );
    },
  },
];
