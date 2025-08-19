"use server";

import { db } from "@/lib/db";
import { FuelType, UseType } from "@/lib/generated/prisma";

export const getAll = async ({
  search
}: {
  search?: string;
}) => {
  try {
    // First, get all equipments from the database
    let equipments = await db.equipment.findMany();

    // Search functionality across multiple fields
    if (search) {
      equipments = equipments.filter(equipment =>
        equipment.brand.toLowerCase().includes(search.toLowerCase()) ||
        equipment.model.toLowerCase().includes(search.toLowerCase()) ||
        equipment.serialNumber.toLowerCase().includes(search.toLowerCase())
      );
    }

    return equipments;
  } catch (error) {
    console.error('Error fetching all equipments:', error);
    return [];
  }
}

export const getEquipments = async ({
  page = 1,
  limit = 10,
  search,
  categories
}: {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string[];
}) => {
  try {
    console.log('getEquipments called with:', { page, limit, search, categories });

    // Build the where clause for filtering
    const whereClause: any = {};

    // Handle search across multiple fields
    if (search) {
      whereClause.OR = [
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Handle category filters
    if (categories && categories.length > 0) {
      const fuelTypeCategories = categories.filter(cat =>
        ['GAS', 'DIESEL', 'ELECTRIC', 'OTHER'].includes(cat)
      );
      const useTypeCategories = categories.filter(cat =>
        ['WOOD_PROCESSING', 'TREE_CUTTING', 'LEGAL_PURPOSES', 'OFFICIAL_TREE_CUTTING', 'OTHER'].includes(cat)
      );

      console.log('Filtered categories:', { fuelTypeCategories, useTypeCategories });

      if (fuelTypeCategories.length > 0 || useTypeCategories.length > 0) {
        whereClause.AND = [];

        if (fuelTypeCategories.length > 0) {
          whereClause.AND.push({
            fuelType: { in: fuelTypeCategories as FuelType[] }
          });
        }

        if (useTypeCategories.length > 0) {
          whereClause.AND.push({
            intendedUse: { in: useTypeCategories as UseType[] }
          });
        }
      }
    }

    console.log('Final where clause:', JSON.stringify(whereClause, null, 2));

    // Get total count for pagination
    const totalEquipments = await db.equipment.count({
      where: whereClause
    });

    // Get paginated equipments
    const equipments = await db.equipment.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Equipment data retrieved successfully',
      total_equipments: totalEquipments,
      offset: (page - 1) * limit,
      limit,
      equipments: equipments
    };
  } catch (error) {
    console.error('Error fetching equipments:', error);
    return {
      success: false,
      time: new Date().toISOString(),
      message: 'Failed to fetch equipment data',
      total_equipments: 0,
      offset: 0,
      limit,
      equipments: []
    };
  }
}

// Get a specific product by its ID
export const getEquipmentById = async (id: string) => {

  // Find the product by its ID
  const equipment = await db.equipment.findUnique({
    where: { id }
  });

  if (!equipment) {
    return {
      success: false,
      message: `Product with ID ${id} not found`,
      equipment: null
    };
  }

  // Mock current time
  const currentTime = new Date().toISOString();

  return {
    success: true,
    time: currentTime,
    message: `Product with ID ${id} found`,
    equipment
  };
}

export const createEquipment = async (data: {
  brand: string;
  model: string;
  serialNumber: string;
  guidBarLength: number;
  horsePower: number;
  fuelType: "GAS" | "DIESEL" | "ELECTRIC" | "OTHER";
  dateAcquired: Date;
  stencilOfSerialNo: string;
  otherInfo: string;
  intendedUse: "WOOD_PROCESSING" | "TREE_CUTTING" | "LEGAL_PURPOSES" | "OFFICIAL_TREE_CUTTING" | "OTHER";
  isNew: boolean;
}) => {
  try {
    // Validate required fields
    if (!data.brand || !data.model || !data.serialNumber) {
      return {
        success: false,
        message: 'Missing required fields: brand, model, and serialNumber are required',
        equipment: null
      };
    }

    // Create a new equipment entry in the database
    const newEquipment = await db.equipment.create({
      data: {
        brand: data.brand.trim(),
        model: data.model.trim(),
        serialNumber: data.serialNumber.trim(),
        guidBarLength: data.guidBarLength,
        horsePower: data.horsePower,
        fuelType: data.fuelType,
        dateAcquired: data.dateAcquired,
        stencilOfSerialNo: data.stencilOfSerialNo.trim(),
        otherInfo: data.otherInfo.trim(),
        intendedUse: data.intendedUse,
        isNew: data.isNew
      }
    });

    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: 'Equipment created successfully',
      equipment: newEquipment
    };
  } catch (error) {
    console.error('Error creating equipment:', error);
    return {
      success: false,
      message: 'Failed to create equipment. Please try again.',
      equipment: null
    };
  }
}

export const updateEquipment = async (id: string, data: {
  brand?: string;
  model?: string;
  serialNumber?: string;
  guidBarLength?: number;
  horsePower?: number;
  fuelType?: "GAS" | "DIESEL" | "ELECTRIC" | "OTHER";
  dateAcquired?: Date;
  stencilOfSerialNo?: string;
  otherInfo?: string;
  intendedUse?: "WOOD_PROCESSING" | "TREE_CUTTING" | "LEGAL_PURPOSES" | "OFFICIAL_TREE_CUTTING" | "OTHER";
  isNew?: boolean;
}) => {
  try {
    // Validate that equipment exists
    const existingEquipment = await db.equipment.findUnique({
      where: { id }
    });

    if (!existingEquipment) {
      return {
        success: false,
        message: `Equipment with ID ${id} not found`,
        equipment: null
      };
    }

    // Prepare update data (only include defined fields)
    const updateData: any = {};
    if (data.brand !== undefined) updateData.brand = data.brand.trim();
    if (data.model !== undefined) updateData.model = data.model.trim();
    if (data.serialNumber !== undefined) updateData.serialNumber = data.serialNumber.trim();
    if (data.guidBarLength !== undefined) updateData.guidBarLength = data.guidBarLength;
    if (data.horsePower !== undefined) updateData.horsePower = data.horsePower;
    if (data.fuelType !== undefined) updateData.fuelType = data.fuelType;
    if (data.dateAcquired !== undefined) updateData.dateAcquired = data.dateAcquired;
    if (data.stencilOfSerialNo !== undefined) updateData.stencilOfSerialNo = data.stencilOfSerialNo.trim();
    if (data.otherInfo !== undefined) updateData.otherInfo = data.otherInfo.trim();
    if (data.intendedUse !== undefined) updateData.intendedUse = data.intendedUse;
    if (data.isNew !== undefined) updateData.isNew = data.isNew;

    // Update the equipment
    const updatedEquipment = await db.equipment.update({
      where: { id },
      data: updateData
    });

    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: 'Equipment updated successfully',
      equipment: updatedEquipment
    };
  } catch (error) {
    console.error('Error updating equipment:', error);
    return {
      success: false,
      message: 'Failed to update equipment. Please try again.',
      equipment: null
    };
  }
}


export const deleteEquipment = async (id: string) => {
  try {
    // Check if equipment exists before attempting to delete
    const existingEquipment = await db.equipment.findUnique({
      where: { id }
    });

    if (!existingEquipment) {
      return {
        success: false,
        message: `Equipment with ID ${id} not found`
      };
    }

    // Delete the equipment by its ID
    const deletedEquipment = await db.equipment.delete({
      where: { id }
    });

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Equipment with model "${deletedEquipment.model}" deleted successfully`,
      equipment: deletedEquipment
    };
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return {
      success: false,
      message: 'Failed to delete equipment. Please try again.'
    };
  }
}