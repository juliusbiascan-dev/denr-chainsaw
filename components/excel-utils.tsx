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

            // Transform data according to schema requirements - aligned with new structure
            const equipmentData = {
              // Auto Number (extract number from CSRALAMINOS format if present)
              autoNumber: (() => {
                const autoNumberValue = row[headers.indexOf('Auto Number')] || '';
                if (autoNumberValue && typeof autoNumberValue === 'string' && autoNumberValue.startsWith('CSRALAMINOS')) {
                  // Extract the number part from CSRALAMINOS format
                  const numberPart = autoNumberValue.replace('CSRALAMINOS', '');
                  return parseInt(numberPart) || 0;
                }
                return 0;
              })(),

              // Owner Information
              ownerFirstName: row[headers.indexOf('First Name')] || row[headers.indexOf('Owner First Name')] || '',
              ownerLastName: row[headers.indexOf('Last Name')] || row[headers.indexOf('Owner Last Name')] || '',
              ownerMiddleName: row[headers.indexOf('Middle Initial')] || row[headers.indexOf('Owner Middle Name')] || '',
              ownerAddress: row[headers.indexOf('Address')] || row[headers.indexOf('Owner Address')] || '',
              ownerContactNumber: row[headers.indexOf('Contact No')] || row[headers.indexOf('Owner Contact Number')] || '',
              ownerEmail: row[headers.indexOf('Email Address')] || row[headers.indexOf('Owner Email')] || '',
              ownerPreferContactMethod: row[headers.indexOf('Preferred Contacting Channel')] || row[headers.indexOf('Owner Preferred Contact Method')] || '',
              ownerIdUrl: '', // Default empty string

              // Equipment Information
              brand: row[headers.indexOf('Chainsaw Brand')] || row[headers.indexOf('Brand')] || '',
              model: row[headers.indexOf('Chainsaw Model')] || row[headers.indexOf('Model')] || '',
              serialNumber: row[headers.indexOf('Chainsaw Serial No')] || row[headers.indexOf('Serial Number')] || '',
              guidBarLength: parseFloat(row[headers.indexOf('Guide Bar Length')] || row[headers.indexOf('Guide Bar Length (inches)')] || '0') || 0,
              horsePower: parseFloat(row[headers.indexOf('Inch/Horse Power')] || row[headers.indexOf('Horse Power')] || '0') || 0,
              fuelType: row[headers.indexOf('Fuel')] || row[headers.indexOf('Fuel Type')] || 'GAS',
              dateAcquired: new Date(row[headers.indexOf('Date of Acquisition')] || row[headers.indexOf('Date Acquired')] || new Date()),
              stencilOfSerialNo: row[headers.indexOf('Stencil of Serial No')] || row[headers.indexOf('Stencil of Serial Number')] || '',
              otherInfo: row[headers.indexOf('Other Info of the Chain')] || row[headers.indexOf('Other Information')] || '',
              intendedUse: row[headers.indexOf('Intended Use of the Chain')] || row[headers.indexOf('Intended Use')] || 'OTHER',
              isNew: (row[headers.indexOf('New Chainsaw or renewal')] || row[headers.indexOf('Is New Equipment')] || '').toLowerCase().includes('new'),

              // Document Requirements
              registrationApplicationUrl: row[headers.indexOf('Signed Chainsaw Registration')] || '',
              officialReceiptUrl: row[headers.indexOf('Application Official Receipt')] || '',
              spaUrl: row[headers.indexOf('SPA (if the applicant is not the owner)')] || '',
              stencilSerialNumberPictureUrl: row[headers.indexOf('Stencil Serial Number Picture')] || '',
              chainsawPictureUrl: row[headers.indexOf('Picture of the Chainsaw')] || '',
              forestTenureAgreementUrl: row[headers.indexOf('Forest Tenure Agreement')] || '',
              businessPermitUrl: row[headers.indexOf('Business Permit (If Business owner)')] || '',
              certificateOfRegistrationUrl: row[headers.indexOf('Certificate of Registration')] || '',
              lguBusinessPermitUrl: row[headers.indexOf('LGU Business Permit')] || '',
              woodProcessingPermitUrl: row[headers.indexOf('Wood Processing Permit')] || '',
              governmentCertificationUrl: row[headers.indexOf('Government Certification')] || '',
              dataPrivacyConsent: (row[headers.indexOf('Data Privacy Consent')] || '').toLowerCase().includes('yes')
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
      // Prepare data for export - aligned with schema and expected format
      const exportData = items.map((equipment, index) => ({
        'Auto Number': `CSRALAMINOS${String(index + 1).padStart(4, '0')}`,
        'Timestamp': equipment.createdAt,
        'First Name': equipment.ownerFirstName,
        'Middle Initial': equipment.ownerMiddleName,
        'Last Name': equipment.ownerLastName,
        'Address': equipment.ownerAddress,
        'Contact No': equipment.ownerContactNumber || '',
        'Email Address': equipment.ownerEmail || '',
        'Preferred Contacting Channel': equipment.ownerPreferContactMethod || '',
        'Chainsaw Brand': equipment.brand,
        'Chainsaw Model': equipment.model,
        'Chainsaw Serial No': equipment.serialNumber,
        'Guide Bar Length': equipment.guidBarLength || '',
        'Inch/Horse Power': equipment.horsePower || '',
        'Fuel': equipment.fuelType,
        'Date of Acquisition': equipment.dateAcquired,
        'Stencil of Serial No': equipment.stencilOfSerialNo,
        'Other Info of the Chain': equipment.otherInfo,
        'Intended Use of the Chain': equipment.intendedUse,
        'New Chainsaw or renewal': equipment.isNew ? 'New' : 'Renewal',
        'Signed Chainsaw Registration': equipment.registrationApplicationUrl || '',
        'Application Official Receipt': equipment.officialReceiptUrl || '',
        'SPA (if the applicant is not the owner)': equipment.spaUrl || '',
        'Stencil Serial Number Picture': equipment.stencilSerialNumberPictureUrl || '',
        'Picture of the Chainsaw': equipment.chainsawPictureUrl || '',
        'Forest Tenure Agreement': equipment.forestTenureAgreementUrl || '',
        'Business Permit (If Business owner)': equipment.businessPermitUrl || '',
        'Certificate of Registration': equipment.certificateOfRegistrationUrl || '',
        'LGU Business Permit': equipment.lguBusinessPermitUrl || '',
        'Wood Processing Permit': equipment.woodProcessingPermitUrl || '',
        'Government Certification': equipment.governmentCertificationUrl || '',
        'Data Privacy Consent': equipment.dataPrivacyConsent ? 'Yes' : 'No',
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability - aligned with new structure
      const columnWidths = [
        { wch: 12 }, // Auto Number
        { wch: 20 }, // Timestamp
        { wch: 15 }, // First Name
        { wch: 15 }, // Middle Initial
        { wch: 15 }, // Last Name
        { wch: 40 }, // Address
        { wch: 15 }, // Contact No
        { wch: 30 }, // Email Address
        { wch: 25 }, // Preferred Contacting Channel
        { wch: 20 }, // Chainsaw Brand
        { wch: 20 }, // Chainsaw Model
        { wch: 20 }, // Chainsaw Serial No
        { wch: 18 }, // Guide Bar Length
        { wch: 18 }, // Inch/Horse Power
        { wch: 12 }, // Fuel
        { wch: 20 }, // Date of Acquisition
        { wch: 25 }, // Stencil of Serial No
        { wch: 35 }, // Other Info of the Chain
        { wch: 25 }, // Intended Use of the Chain
        { wch: 20 }, // New Chainsaw or renewal
        { wch: 30 }, // Signed Chainsaw Registration
        { wch: 30 }, // Application Official Receipt
        { wch: 35 }, // SPA (if the applicant is not the owner)
        { wch: 30 }, // Stencil Serial Number Picture
        { wch: 25 }, // Picture of the Chainsaw
        { wch: 25 }, // Forest Tenure Agreement
        { wch: 30 }, // Business Permit (If Business owner)
        { wch: 30 }, // Certificate of Registration
        { wch: 25 }, // LGU Business Permit
        { wch: 25 }, // Wood Processing Permit
        { wch: 25 }, // Government Certification
        { wch: 20 }, // Data Privacy Consent
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
