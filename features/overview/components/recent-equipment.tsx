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

// Equipment type definition
type Equipment = {
  id: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerMiddleName: string;
  brand: string;
  model: string;
  serialNumber: string;
  guidBarLength: number;
  horsePower: number;
  fuelType: string;
  dateAcquired: Date;
  stencilOfSerialNo: string;
  otherInfo: string;
  intendedUse: string;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Function to get recent equipment from database
async function getRecentEquipments(): Promise<Equipment[]> {
  try {
    return await db.equipment.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error fetching recent equipment:', error);
    return [];
  }
}


// Function to check if equipment is expiring soon
function isExpiringSoon(dateAcquired: Date): boolean {
  const now = new Date();
  const validUntil = new Date(dateAcquired.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  return validUntil <= thirtyDaysFromNow && validUntil > now;
}

// Function to check if equipment is expired
function isExpired(dateAcquired: Date): boolean {
  const validUntil = new Date(dateAcquired.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  return validUntil < new Date();
}

// Function to get valid until date
function getValidUntilDate(dateAcquired: Date): Date {
  return new Date(dateAcquired.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
}

// Function to format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
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
                    {equipment.fuelType}
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
