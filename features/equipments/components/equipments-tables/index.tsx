'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { QRPrintUtils } from '@/components/qr-print-utils';
import { Equipment } from '@/constants/data';
import { EquipmentCard } from '../equipment-card';

import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import PageContainer from '@/components/layout/page-container';
interface EquipmentTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}
export function EquipmentTable<TData, TValue>({
  data,
  totalItems,
  columns
}: EquipmentTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  console.log('Table data:', data);
  console.log('Columns:', columns);
  console.log('Total items:', totalItems);

  const { table } = useDataTable({
    data, // equipments data
    columns, // equipments columns
    pageCount: pageCount,
    shallow: false, //Setting to false triggers a network request with the updated querystring.
    debounceMs: 500,
    enableRowSelection: true,
    initialState: {
      rowSelection: {}
    }
  });

  const selectedEquipments = table.getFilteredSelectedRowModel().rows.map(row => row.original) as Equipment[];

  return (
    <div className="w-full space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block flex-1 w-full min-h-[400px]">
        <DataTable
          table={table}
          actionBar={
            <QRPrintUtils
              equipments={data as Equipment[]}
              selectedEquipments={selectedEquipments}
            />
          }
        >
          <DataTableToolbar table={table}>
            <QRPrintUtils
              equipments={data as Equipment[]}
              selectedEquipments={selectedEquipments}
            />
          </DataTableToolbar>
        </DataTable>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Sticky Toolbar */}
        <div className="sticky top-0 z-10 bg-background pb-4">
          <DataTableToolbar table={table}>
            <QRPrintUtils
              equipments={data as Equipment[]}
              selectedEquipments={selectedEquipments}
            />
          </DataTableToolbar>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 pb-20">
          {table.getRowModel().rows.map((row) => (
            <EquipmentCard
              key={row.id}
              equipment={row.original as Equipment}
              isSelected={row.getIsSelected()}
              onSelectionChange={(checked: boolean) => row.toggleSelected(!!checked)}
            />
          ))}
          {table.getRowModel().rows.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found</p>
            </div>
          )}

          {/* Mobile Pagination */}
          <div className="flex items-center justify-between px-2">
            <button
              className="p-2 text-sm text-muted-foreground disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <button
              className="p-2 text-sm text-muted-foreground disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        {selectedEquipments.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg">
            <QRPrintUtils
              equipments={data as Equipment[]}
              selectedEquipments={selectedEquipments}
            />
          </div>
        )}
      </div>
    </div>
  );
}
