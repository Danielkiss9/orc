import { cn, Card, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@orc/web/ui/custom-ui';

interface DataTableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The number of columns in the table.
   * @type number
   */
  columnCount: number;

  /**
   * The number of rows in the table.
   * @default 10
   * @type number | undefined
   */
  rowCount?: number;

  /**
   * The number of searchable columns in the table.
   * @default 0
   * @type number | undefined
   */
  searchableColumnCount?: number;

  /**
   * The number of filterable columns in the table.
   * @default 0
   * @type number | undefined
   */
  filterableColumnCount?: number;

  /**
   * Flag to show the table view options.
   * @default undefined
   * @type boolean | undefined
   */
  showViewOptions?: boolean;

  /**
   * The number of actions in the table (not including the view options).
   * @default 1
   * @type number | undefined
   */
  actionsCount?: number;

  /**
   * The width of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS width value is accepted.
   * @default ["auto"]
   * @type string[] | undefined
   */
  cellWidths?: string[];

  /**
   * Flag to show the pagination bar.
   * @default true
   * @type boolean | undefined
   */
  withPagination?: boolean;

  /**
   * Flag to prevent the table cells from shrinking.
   * @default false
   * @type boolean | undefined
   */
  shrinkZero?: boolean;
}

export function DataTableSkeleton(props: DataTableSkeletonProps) {
  const {
    columnCount,
    rowCount = 10,
    searchableColumnCount = 0,
    filterableColumnCount = 0,
    actionsCount = 0,
    showViewOptions = true,
    cellWidths = ['auto'],
    withPagination = true,
    shrinkZero = false,
    className,
    ...skeletonProps
  } = props;

  return (
    <Card className="p-2 shadow-xl border rounded-lg w-full sm:max-w-full">
      <div className={cn('w-full space-y-2.5 overflow-auto px-5 pt-2', className)} {...skeletonProps}>
        <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
          <div className="flex flex-1 items-center space-x-2">
            {searchableColumnCount > 0
              ? Array.from({ length: searchableColumnCount }).map((_, i) => <Skeleton key={i} className="h-7 w-40 lg:w-60" />)
              : null}
            {filterableColumnCount > 0
              ? Array.from({ length: filterableColumnCount }).map((_, i) => <Skeleton key={i} className="h-7 w-[4.5rem] border-dashed" />)
              : null}
          </div>
          {showViewOptions && actionsCount > 0
            ? Array.from({ length: actionsCount }).map((_, i) => <Skeleton key={i} className="ml-auto h-7 w-[8rem]" />)
            : null}

          {/* This is the default skeleton for the view options */}
          <Skeleton className="ml-auto hidden h-7 w-[4.5rem] lg:flex" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {Array.from({ length: 1 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableHead
                      key={j}
                      style={{
                        width: cellWidths[j],
                        minWidth: shrinkZero ? cellWidths[j] : 'auto',
                      }}
                    >
                      <Skeleton className="h-6 w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableCell
                      key={j}
                      style={{
                        width: cellWidths[j],
                        minWidth: shrinkZero ? cellWidths[j] : 'auto',
                      }}
                    >
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {withPagination ? (
          <div className="flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8">
            <Skeleton className="h-7 w-40 shrink-0" />
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-[4.5rem]" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="hidden size-7 lg:block" />
                <Skeleton className="size-7" />
                <Skeleton className="size-7" />
                <Skeleton className="hidden size-7 lg:block" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
