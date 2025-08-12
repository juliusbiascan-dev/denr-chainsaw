import { Equipment } from '@/constants/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, XCircle, QrCode, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { AlertModal } from '@/components/modal/alert-modal';
import { deleteEquipmentAction } from '@/actions/equipment';

interface EquipmentCardProps {
  equipment: Equipment;
  isSelected: boolean;
  onSelectionChange: (checked: boolean) => void;
}

export function EquipmentCard({ equipment, isSelected, onSelectionChange }: EquipmentCardProps) {
  const [showQR, setShowQR] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteEquipmentAction(equipment.id);

      if (result.success) {
        router.refresh();
        router.push('/dashboard/equipments');
      } else {
        console.error('Error deleting equipment:', result.error);
      }
    } catch (error) {
      console.error('Error deleting equipment:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelectionChange}
              aria-label="Select equipment"
            />
            <h3 className="font-medium">{`${equipment.brand} ${equipment.model}`}</h3>
          </div>
          <Badge
            variant={equipment.status === 'active' ? 'default' : 'secondary'}
            className='capitalize'
          >
            {equipment.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">Intended Use</label>
                  <Badge variant='outline' className='capitalize ml-2 dark:border-gray-600 dark:text-gray-300'>
                    {equipment.isNew ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                    {equipment.intendedUse.replace('_', ' ').toLowerCase()}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">Serial Number</label>
                  <p className="mt-1 dark:text-gray-300">{equipment.serialNumber}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">Date Acquired</label>
                  <p className="mt-1 dark:text-gray-300">
                    {new Date(equipment.dateAcquired).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">Specifications</label>
                  <p className="mt-1 dark:text-gray-300">
                    Guid Bar Length: {equipment.guidBarLength}mm<br />
                    Horse Power: {equipment.horsePower}hp<br />
                    Fuel Type: {equipment.fuelType}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">Additional Info</label>
                  <p className="mt-1 dark:text-gray-300">{equipment.otherInfo}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground dark:text-gray-400">Last Updated</label>
                  <p className="mt-1 dark:text-gray-300">
                    {new Date(equipment.updatedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQR(!showQR)}
                    className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/equipments/${equipment.id}`)}
                    className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>

                {showQR && (
                  <div className="mt-4 p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
                    <QRCodeDisplay
                      value={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3001'}/equipments/${equipment.id}`}
                      size={120}
                      className="mx-auto"
                    />
                    <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">
                      {`${equipment.brand} ${equipment.model}`}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <AlertModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
