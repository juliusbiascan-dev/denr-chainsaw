
import { Equipment } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { EquipmentTable } from './equipments-tables';
import { columns } from './equipments-tables/columns';
import { getEquipments } from '@/data/equipment';

type EquipmentListingPage = {};

export default async function EquipmentListingPage({ }: EquipmentListingPage) {
  try {
    // Showcasing the use of search params cache in nested RSCs
    const page = searchParamsCache.get('page');
    const search = searchParamsCache.get('name');
    const pageLimit = searchParamsCache.get('perPage');
    const fuelType = searchParamsCache.get('fuelType');
    const intendedUse = searchParamsCache.get('intendedUse');

    // Parse filter categories if they exist
    let parsedCategories: string[] = [];
    if (fuelType) {
      parsedCategories.push(...fuelType.split(',').map(cat => cat.trim()));
    }
    if (intendedUse) {
      parsedCategories.push(...intendedUse.split(',').map(cat => cat.trim()));
    }

    const filters = {
      page: page || 1,
      limit: pageLimit || 10,
      ...(search && { search }),
      ...(parsedCategories.length > 0 && { categories: parsedCategories })
    };

    console.log('Applied filters:', filters);
    const data = await getEquipments(filters);
    console.log('Equipment data:', data);

    if (!data.success) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Failed to load equipments</h3>
            <p className="text-gray-500">{data.message || 'An error occurred while fetching equipment data.'}</p>
          </div>
        </div>
      );
    }

    const totalEquipments = data.total_equipments;
    const equipments: Equipment[] = data.equipments.map((equipment: any) => {
      // Check if the equipment is expired (2 years validity from date acquired)
      const dateAcquired = new Date(equipment.dateAcquired);
      const currentDate = new Date();
      const twoYearsFromAcquisition = new Date(dateAcquired);
      twoYearsFromAcquisition.setFullYear(dateAcquired.getFullYear() + 2);
      const isExpired = currentDate > twoYearsFromAcquisition; // Equipment is expired if current date is past 2 years from acquisition

      // Ensure all dates are in ISO format for consistent handling
      return {
        id: equipment.id,
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        guidBarLength: equipment.guidBarLength,
        horsePower: equipment.horsePower,
        fuelType: equipment.fuelType,
        dateAcquired: dateAcquired.toISOString(),
        stencilOfSerialNo: equipment.stencilOfSerialNo,
        otherInfo: equipment.otherInfo,
        intendedUse: equipment.intendedUse,
        isNew: equipment.isNew,
        createdAt: new Date(equipment.createdAt).toISOString(),
        updatedAt: new Date(equipment.updatedAt).toISOString(),
        status: isExpired ? 'inactive' : 'active'
      };
    });

    return (
      <EquipmentTable
        data={equipments}
        totalItems={totalEquipments}
        columns={columns}
      />
    );
  } catch (error) {
    console.error('Error in EquipmentListingPage:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
          <p className="text-gray-500">Unable to load equipment data. Please try again later.</p>
        </div>
      </div>
    );
  }
}
