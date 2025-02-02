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
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { deleteCluster } from '@orc/web/actions/cluster/delete';
import { DeleteClusterModal } from '@orc/web/components/modals/cluster-delete-modal';
import { GetAllClustersResponse } from './page';
import { useRouter } from 'next/navigation';
import { SortButton } from '@orc/web/components/data-table/utils';

export const columns: ColumnDef<GetAllClustersResponse>[] = [
  {
    accessorKey: 'name',
    header: 'Cluster',
    cell: ({ row }) => {
      const { push } = useRouter();

      return (
        <div className='cursor-pointer underline'
          onClick={() => {
            push(`/dashboard/clusters/${row.original.id}`);
          }}
        >
          {row.original.name}
        </div>
      );
    },
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
      const { status, orphanedResources } = row.original;

      if (status === 'PENDING' || orphanedResources.length === 0) {
        return 'N/A';
      }

      return (
        <div className="flex items-center">
          {orphanedResources.length === 0 ? (
            <Badge variant="success">{orphanedResources.length}</Badge>
          ) : orphanedResources.length > 10 ? (
            <Badge variant="error">{orphanedResources.length}</Badge>
          ) : (
            <Badge variant="warning">{orphanedResources.length}</Badge>
          )}
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
      const { push } = useRouter();

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
              <DropdownMenuItem
                onClick={() => {
                  push(`/dashboard/clusters/${props.row.original.id}`);
                }}
              >
                View
              </DropdownMenuItem>
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
