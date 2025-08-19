'use client';

import { Equipment } from '@/constants/data';
import { Button } from '@/components/ui/button';
import { Printer, Download, MoreVertical } from 'lucide-react';
import QRCode from 'qrcode';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QRPrintUtilsProps {
  equipments: Equipment[];
  selectedEquipments?: Equipment[];
}

export function QRPrintUtils({ equipments, selectedEquipments }: QRPrintUtilsProps) {
  // Generate QR code and overlay logo at the center
  const generateQRCodeDataURL = async (equipment: Equipment, size: number = 200): Promise<string> => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3001'}/equipments/${equipment.id}`;
    // DENR color scheme
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#08933D', // Salem as Primary
        light: '#DDE5E1' // Nubula as BG
      }
    });

    // Create canvas and draw QR code
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return qrCodeDataUrl;

    // Draw QR code
    const qrImg = new window.Image();
    qrImg.src = qrCodeDataUrl;
    await new Promise((resolve) => {
      qrImg.onload = resolve;
    });
    ctx.drawImage(qrImg, 0, 0, size, size);

    // Draw logo at center
    const logoSize = size * 0.18; // 18% of QR code size
    const logoImg = new window.Image();
    logoImg.src = '/logo.jpg'; // Ensure logo.jpg is in public/
    await new Promise((resolve) => {
      logoImg.onload = resolve;
    });
    const x = (size - logoSize) / 2;
    const y = (size - logoSize) / 2;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.drawImage(logoImg, x, y, logoSize, logoSize);
    ctx.restore();

    return canvas.toDataURL('image/png');
  };

  const printQRCodes = async (items: Equipment[]) => {
    try {
      // Determine layout based on number of items
      const itemCount = items.length;
      const isSmallCount = itemCount <= 2;
      const isSingleItem = itemCount === 1;

      // Adjust QR code size based on item count
      const qrSize = isSmallCount ? 280 : 200;

      const qrCodes = await Promise.all(
        items.map(async (equipment) => ({
          equipment,
          dataURL: await generateQRCodeDataURL(equipment, qrSize)
        }))
      );

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      const maxWidth = isSmallCount ? '400px' : '220px';
      const gridColumns = isSingleItem ? '1fr' : isSmallCount ? 'repeat(auto-fit, minmax(300px, 1fr))' : 'repeat(auto-fit, minmax(220px, 1fr))';
      const gridJustify = isSingleItem ? 'center' : 'start';
      const containerMaxWidth = isSmallCount ? '800px' : 'none';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Equipment QR Codes</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              margin: 0;
              background: #DDE5E1; /* Nubula */
              padding: 0;
              color: #0C1B72; /* Arapawa */
              min-height: 100vh;
            }
            .header {
              text-align: center;
              margin-bottom: 24px;
              padding: 24px 10px 0 10px;
              background: #08933D; /* Salem */
              color: #fff;
              border-bottom: 4px solid #7FA8A7; /* Gumbo */
            }
            .header h1 {
              font-size: clamp(22px, 5vw, 32px);
              margin: 10px 0 0 0;
              letter-spacing: 1px;
            }
            .header p {
              font-size: clamp(13px, 3vw, 16px);
              margin: 8px 0;
              color: #DDE5E1;
            }
            .qr-container {
              max-width: ${containerMaxWidth};
              margin: 0 auto;
              padding: 0 24px 24px 24px;
            }
            .qr-grid {
              display: grid;
              grid-template-columns: ${gridColumns};
              gap: ${isSmallCount ? '32px' : '24px'};
              margin: 24px 0;
              justify-items: ${gridJustify};
              align-items: start;
            }
            .qr-item {
              border: 2px solid #7FA8A7; /* Gumbo */
              border-radius: 16px;
              padding: ${isSmallCount ? '24px 16px' : '18px 12px'};
              text-align: center;
              background: #fff;
              box-shadow: 0 2px 8px rgba(12,27,114,0.08);
              page-break-inside: avoid;
              width: 100%;
              max-width: ${maxWidth};
              box-sizing: border-box;
              transition: box-shadow 0.2s;
              ${isSingleItem ? 'margin: 0 auto;' : ''}
            }
            .qr-item:hover {
              box-shadow: 0 4px 16px rgba(8,147,61,0.12);
              border-color: #08933D;
            }
            .qr-item img {
              margin: 10px 0;
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              background: #DDE5E1;
              border: 1px solid #7FA8A7;
              width: ${qrSize}px;
              height: ${qrSize}px;
            }
            .equipment-name {
              font-weight: 600;
              font-size: clamp(14px, 3vw, ${isSmallCount ? '20px' : '18px'});
              margin-bottom: 6px;
              color: #08933D;
              word-break: break-word;
            }
            .equipment-id {
              font-size: clamp(11px, 2.5vw, ${isSmallCount ? '15px' : '13px'});
              color: #0C1B72;
              margin-bottom: 8px;
              word-break: break-all;
            }
            .equipment-category {
              font-size: clamp(10px, 2vw, ${isSmallCount ? '14px' : '12px'});
              color: #fff;
              background: #7FA8A7;
              padding: 3px 10px;
              border-radius: 6px;
              display: inline-block;
              margin-top: 6px;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              letter-spacing: 0.5px;
            }
            @media screen and (max-width: 600px) {
              .header {
                padding: 16px 4px 0 4px;
              }
              .qr-container {
                padding: 0 8px 8px 8px;
              }
              .qr-grid {
                grid-template-columns: 1fr;
                gap: 16px;
                justify-items: center;
              }
              .qr-item {
                padding: 12px 6px;
                max-width: 100%;
              }
              .qr-item img {
                width: ${isSmallCount ? '240px' : '200px'};
                height: ${isSmallCount ? '240px' : '200px'};
              }
            }
            @media screen and (max-width: 400px) {
              .qr-item img {
                width: ${isSmallCount ? '200px' : '180px'};
                height: ${isSmallCount ? '200px' : '180px'};
              }
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .qr-grid {
                gap: ${isSmallCount ? '20px' : '10px'};
              }
              .header {
                background: #08933D !important;
                color: #fff !important;
                border-bottom: 2px solid #7FA8A7 !important;
              }
              .qr-item {
                page-break-inside: avoid;
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DENR Chainsaw Equipment QR Codes</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Items: ${qrCodes.length}</p>
          </div>
          <div class="qr-container">
            <div class="qr-grid">
              ${qrCodes.map(({ equipment, dataURL }) => `
                <div class="qr-item">
                  <div class="equipment-name">${equipment.brand} ${equipment.model}</div>
                  <div class="equipment-id">ID: ${equipment.id}</div>
                  <img src="${dataURL}" alt="QR Code for ${equipment.brand} ${equipment.model}" />
                  <div class="equipment-category">${equipment.fuelType} | ${equipment.intendedUse}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 1000);

    } catch (error) {
      console.error('Error generating QR codes for printing:', error);
      alert('Error generating QR codes for printing');
    }
  };

  const downloadQRCodes = async (items: Equipment[]) => {
    try {
      const JSZip = (await import('jszip')).default;
      const zipFile = new JSZip();

      // Determine QR code size based on number of items
      const itemCount = items.length;
      const isSmallCount = itemCount <= 2;
      const qrSize = isSmallCount ? 280 : 200;

      const qrCodes = await Promise.all(
        items.map(async (equipment) => ({
          equipment,
          dataURL: await generateQRCodeDataURL(equipment, qrSize)
        }))
      );

      // Add QR codes to zip
      qrCodes.forEach(({ equipment, dataURL }) => {
        const base64Data = dataURL.split(',')[1];
        zipFile.file(`${equipment.brand}-${equipment.model}-${equipment.id}.png`, base64Data, { base64: true });
      });

      // Generate and download zip
      const content = await zipFile.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `equipment-qr-codes-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR codes:', error);
      alert('Error downloading QR codes');
    }
  };

  const hasSelection = selectedEquipments && selectedEquipments.length > 0;
  const itemsToProcess = hasSelection ? selectedEquipments : equipments;

  return (
    <>
      {/* Mobile View - Context Menu */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={itemsToProcess.length === 0}>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => printQRCodes(itemsToProcess)}>
              <Printer className="h-4 w-4 mr-2" />
              <span>Print {hasSelection ? `(${selectedEquipments.length})` : `(${equipments.length})`}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadQRCodes(itemsToProcess)}>
              <Download className="h-4 w-4 mr-2" />
              <span>Download {hasSelection ? `(${selectedEquipments.length})` : `(${equipments.length})`}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop View - Regular Buttons */}
      <div className="hidden sm:flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => printQRCodes(itemsToProcess)}
          disabled={itemsToProcess.length === 0}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print {hasSelection ? `Selected (${selectedEquipments.length})` : `All (${equipments.length})`} QR Codes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadQRCodes(itemsToProcess)}
          disabled={itemsToProcess.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Download {hasSelection ? `Selected (${selectedEquipments.length})` : `All (${equipments.length})`} QR Codes
        </Button>
      </div>
    </>
  );
}
