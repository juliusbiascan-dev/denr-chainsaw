import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';
import { Equipment } from '@/constants/data';
import { formatFuelType, formatDate } from '@/lib/format';

// Function to get recent equipment from database
async function getRecentEquipments(): Promise<Equipment[]> {
  try {
    const equipments = await db.equipment.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform database equipment to match the Equipment type
    return equipments.map((equipment) => {
      // Check if the equipment is expired (2 years validity from date acquired)
      const dateAcquired = new Date(equipment.dateAcquired);
      const currentDate = new Date();
      const twoYearsFromAcquisition = new Date(dateAcquired);
      twoYearsFromAcquisition.setFullYear(dateAcquired.getFullYear() + 2);
      const isExpired = currentDate > twoYearsFromAcquisition;

      return {
        id: equipment.id,
        // Owner Information
        ownerFirstName: equipment.ownerFirstName,
        ownerLastName: equipment.ownerLastName,
        ownerMiddleName: equipment.ownerMiddleName,
        ownerAddress: equipment.ownerAddress,
        ownerContactNumber: equipment.ownerContactNumber,
        ownerEmail: equipment.ownerEmail,
        ownerPreferContactMethod: equipment.ownerPreferContactMethod,
        ownerIdUrl: equipment.ownerIdUrl || undefined,
        // Equipment Information
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        guidBarLength: equipment.guidBarLength || undefined,
        horsePower: equipment.horsePower || undefined,
        fuelType: equipment.fuelType,
        dateAcquired: dateAcquired.toISOString(),
        stencilOfSerialNo: equipment.stencilOfSerialNo,
        otherInfo: equipment.otherInfo,
        intendedUse: equipment.intendedUse,
        isNew: equipment.isNew,
        createdAt: new Date(equipment.createdAt).toISOString(),
        updatedAt: new Date(equipment.updatedAt).toISOString(),
        status: isExpired ? 'inactive' : 'active',
        // Document Requirements
        registrationApplicationUrl: equipment.registrationApplicationUrl || undefined,
        officialReceiptUrl: equipment.officialReceiptUrl || undefined,
        spaUrl: equipment.spaUrl || undefined,
        stencilSerialNumberPictureUrl: equipment.stencilSerialNumberPictureUrl || undefined,
        chainsawPictureUrl: equipment.chainsawPictureUrl || undefined,
        // Additional Requirements
        forestTenureAgreementUrl: equipment.forestTenureAgreementUrl || undefined,
        businessPermitUrl: equipment.businessPermitUrl || undefined,
        certificateOfRegistrationUrl: equipment.certificateOfRegistrationUrl || undefined,
        lguBusinessPermitUrl: equipment.lguBusinessPermitUrl || undefined,
        woodProcessingPermitUrl: equipment.woodProcessingPermitUrl || undefined,
        governmentCertificationUrl: equipment.governmentCertificationUrl || undefined,
        // Data Privacy Consent
        dataPrivacyConsent: equipment.dataPrivacyConsent
      };
    });
  } catch (error) {
    console.error('Error fetching recent equipment:', error);
    return [];
  }
}

// Function to check if equipment is expiring soon
function isExpiringSoon(dateAcquired: string): boolean {
  const now = new Date();
  const acquiredDate = new Date(dateAcquired);
  const validUntil = new Date(acquiredDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  return validUntil <= thirtyDaysFromNow && validUntil > now;
}

// Function to check if equipment is expired
function isExpired(dateAcquired: string): boolean {
  const acquiredDate = new Date(dateAcquired);
  const validUntil = new Date(acquiredDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  return validUntil < new Date();
}

// Function to get valid until date
function getValidUntilDate(dateAcquired: string): Date {
  const acquiredDate = new Date(dateAcquired);
  return new Date(acquiredDate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
}

// Function to format owner's full name
function formatOwnerName(firstName: string, lastName: string, middleName: string): string {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ');
}

export async function RecentEquipment() {
  const recentEquipments = await getRecentEquipments();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Equipment</CardTitle>
        <CardDescription>
          {recentEquipments.length > 0
            ? `${recentEquipments.length} equipment items added recently.`
            : 'No equipment found.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentEquipments.map((equipment) => (
            <div
              key={equipment.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0"
            >
              <div className="flex items-center sm:block">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs font-semibold">
                    {equipment.model.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="sm:ml-4 space-y-1 flex-1">
                <p className="text-sm leading-none font-medium truncate w-[100px] sm:w-auto">{equipment.brand} {equipment.model}</p>
                <p className="text-muted-foreground text-sm truncate w-[120px] sm:w-auto">SN: {equipment.serialNumber}</p>
                <p className="text-muted-foreground text-sm truncate w-[150px] sm:w-auto">
                  Owner: {formatOwnerName(equipment.ownerFirstName, equipment.ownerLastName, equipment.ownerMiddleName)}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {formatFuelType(equipment.fuelType)}
                  </Badge>
                  {isExpired(equipment.dateAcquired) && (
                    <Badge variant="destructive" className="text-xs">
                      Expired
                    </Badge>
                  )}
                  {isExpiringSoon(equipment.dateAcquired) && !isExpired(equipment.dateAcquired) && (
                    <Badge variant="secondary" className="text-xs">
                      Expiring Soon
                    </Badge>
                  )}
                </div>
              </div>
              <div className="sm:ml-auto sm:text-right space-y-1 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                <div className="text-xs text-muted-foreground">Valid Until</div>
                <div className="text-sm font-medium">{formatDate(getValidUntilDate(equipment.dateAcquired))}</div>
                <div className="text-xs text-muted-foreground mt-2">Created</div>
                <div className="text-xs font-medium">{formatDate(equipment.createdAt)}</div>
              </div>
            </div>
          ))}
          {recentEquipments.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No equipment found. Add some equipment to see them here.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
