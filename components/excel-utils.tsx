'use client';

import { Equipment } from '@/constants/data';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { bulkImportEquipmentAction } from '@/actions/equipment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExcelUtilsProps {
  equipments: Equipment[];
  selectedEquipments?: Equipment[];
}

export function ExcelUtils({ equipments, selectedEquipments }: ExcelUtilsProps) {
  const importFromExcel = () => {
    try {
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xlsx,.xls';
      fileInput.style.display = 'none';

      fileInput.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) return;

        try {
          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });

          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            alert('Excel file must have at least a header row and one data row');
            return;
          }

          // Get headers from first row
          const headers = jsonData[0] as string[];

          // Process data rows
          const importedEquipments: any[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (!row || row.length === 0) continue;

            // Transform data according to schema requirements
            const equipmentData = {
              // Owner Information
              ownerFirstName: row[headers.indexOf('Owner First Name')] || '',
              ownerLastName: row[headers.indexOf('Owner Last Name')] || '',
              ownerMiddleName: row[headers.indexOf('Owner Middle Name')] || '',
              ownerAddress: row[headers.indexOf('Owner Address')] || '',
              ownerContactNumber: row[headers.indexOf('Owner Contact Number')] || '',
              ownerEmail: row[headers.indexOf('Owner Email')] || '',
              ownerPreferContactMethod: row[headers.indexOf('Owner Preferred Contact Method')] || '',
              ownerIdUrl: '', // Default empty string

              // Equipment Information
              brand: row[headers.indexOf('Brand')] || '',
              model: row[headers.indexOf('Model')] || '',
              serialNumber: row[headers.indexOf('Serial Number')] || '',
              guidBarLength: parseFloat(row[headers.indexOf('Guide Bar Length (inches)')]) || 0,
              horsePower: parseFloat(row[headers.indexOf('Horse Power')]) || 0,
              fuelType: row[headers.indexOf('Fuel Type')] || 'GAS',
              dateAcquired: new Date(row[headers.indexOf('Date Acquired')] || new Date()),
              stencilOfSerialNo: row[headers.indexOf('Stencil of Serial Number')] || '',
              otherInfo: row[headers.indexOf('Other Information')] || '',
              intendedUse: row[headers.indexOf('Intended Use')] || 'OTHER',
              isNew: row[headers.indexOf('Is New Equipment')] === 'Yes'
            };

            importedEquipments.push(equipmentData);
          }

          if (importedEquipments.length === 0) {
            alert('No valid equipment data found in the Excel file');
            return;
          }

          // Show confirmation dialog
          const confirmed = confirm(`Import ${importedEquipments.length} equipment records? This will add them to the database.`);
          if (!confirmed) return;

          // Call the server action to import the data
          const result = await bulkImportEquipmentAction(importedEquipments);

          if (result.success) {
            alert(`Import completed!\n\nSuccessfully imported: ${result.details.success} records\nFailed: ${result.details.failed} records${result.details.errors.length > 0 ? '\n\nErrors:\n' + result.details.errors.slice(0, 5).join('\n') : ''}`);

            // Refresh the page to show new data
            window.location.reload();
          } else {
            alert(`Import failed: ${result.message}\n\nErrors:\n${result.details.errors.slice(0, 10).join('\n')}`);
          }

        } catch (error) {
          console.error('Error importing Excel file:', error);
          alert('Error importing Excel file. Please check the file format.');
        }
      };

      // Trigger file selection
      document.body.appendChild(fileInput);
      fileInput.click();
      document.body.removeChild(fileInput);

    } catch (error) {
      console.error('Error setting up file import:', error);
      alert('Error setting up file import');
    }
  };

  const exportToExcel = (items: Equipment[]) => {
    try {
      // Prepare data for export
      const exportData = items.map((equipment) => ({
        'Equipment ID': equipment.id,
        'Owner First Name': equipment.ownerFirstName,
        'Owner Last Name': equipment.ownerLastName,
        'Owner Middle Name': equipment.ownerMiddleName,
        'Owner Address': equipment.ownerAddress,
        'Owner Contact Number': equipment.ownerContactNumber || '',
        'Owner Email': equipment.ownerEmail || '',
        'Owner Preferred Contact Method': equipment.ownerPreferContactMethod || '',
        'Brand': equipment.brand,
        'Model': equipment.model,
        'Serial Number': equipment.serialNumber,
        'Guide Bar Length (inches)': equipment.guidBarLength,
        'Horse Power': equipment.horsePower,
        'Fuel Type': equipment.fuelType,
        'Date Acquired': equipment.dateAcquired,
        'Stencil of Serial Number': equipment.stencilOfSerialNo,
        'Other Information': equipment.otherInfo,
        'Intended Use': equipment.intendedUse,
        'Is New Equipment': equipment.isNew ? 'Yes' : 'No',
        'Status': equipment.status,
        'Created At': equipment.createdAt,
        'Updated At': equipment.updatedAt,
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability
      const columnWidths = [
        { wch: 15 }, // Equipment ID
        { wch: 20 }, // Owner First Name
        { wch: 20 }, // Owner Last Name
        { wch: 20 }, // Owner Middle Name
        { wch: 40 }, // Owner Address
        { wch: 20 }, // Owner Contact Number
        { wch: 30 }, // Owner Email
        { wch: 25 }, // Owner Preferred Contact Method
        { wch: 15 }, // Brand
        { wch: 20 }, // Model
        { wch: 20 }, // Serial Number
        { wch: 25 }, // Guide Bar Length
        { wch: 15 }, // Horse Power
        { wch: 15 }, // Fuel Type
        { wch: 15 }, // Date Acquired
        { wch: 25 }, // Stencil of Serial Number
        { wch: 40 }, // Other Information
        { wch: 25 }, // Intended Use
        { wch: 20 }, // Is New Equipment
        { wch: 15 }, // Status
        { wch: 20 }, // Created At
        { wch: 20 }, // Updated At
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Equipment Data');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `equipment-data-${timestamp}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting data to Excel');
    }
  };

  const hasSelection = selectedEquipments && selectedEquipments.length > 0;
  const itemsToProcess = hasSelection ? selectedEquipments : equipments;

  return (
    <>
      {/* Mobile View - Context Menu */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => exportToExcel(itemsToProcess)}>
              <Download className="h-4 w-4 mr-2" />
              <span>Export to Excel {hasSelection ? `(${selectedEquipments.length})` : `(${equipments.length})`}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={importFromExcel}>
              <Upload className="h-4 w-4 mr-2" />
              <span>Import from Excel</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop View - Regular Buttons */}
      <div className="hidden sm:flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToExcel(itemsToProcess)}
        >
          <Download className="h-4 w-4 mr-2" />
          Export to Excel {hasSelection ? `Selected (${selectedEquipments.length})` : `All (${equipments.length})`}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={importFromExcel}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import from Excel
        </Button>
      </div>
    </>
  );
}
