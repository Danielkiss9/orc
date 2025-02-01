import type { ColumnDef } from '@tanstack/react-table';
import type { OrphanedResource } from '@prisma/client';
import { getResourceAge } from '@orc/utils';
import { SortButton } from '@orc/web/components/data-table/utils';

export const columns: ColumnDef<OrphanedResource>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'kind',
    header: ({ column }) => <SortButton column={column}>Kind</SortButton>,
  },
  {
    accessorKey: 'namespace',
    header: 'Namespace',
    cell: ({ row }) => {
      if (row.original.namespace) {
        return row.original.namespace;
      }

      return '*';
    },
  },
  {
    accessorKey: 'age',
    header: ({ column }) => <SortButton column={column}>Age</SortButton>,
    cell: ({ row }) => {
      if (row.original.age) {
        return getResourceAge(new Date(row.original.age));
      }

      return 'N/A';
    },
  },
  {
    accessorKey: 'discoveredAt',
    header: ({ column }) => <SortButton column={column}>Discovered At</SortButton>,
    cell: ({ row }) => {
      if (row.original.discoveredAt) {
        return new Date(row.original.discoveredAt).toLocaleString();
      }

      return 'N/A';
    },
  },
];
