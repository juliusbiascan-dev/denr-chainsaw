// 'use server';

// import { db } from "@/lib/db";

// export async function getCategories() {
//   try {
//     const equipments = await db.equipment.findMany({
//       select: {
//         category: true
//       },
//       distinct: ['category']
//     });

//     return equipments.map(equipment => ({
//       value: equipment.category,
//       label: equipment.category
//     }));
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return [];
//   }
// }

'use client';

import { useState, useEffect } from 'react';

// Default categories in case of empty database or error
export const DEFAULT_FUEL_TYPES = [
  { value: 'GAS', label: 'Gas' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'OTHER', label: 'Other' }
];

export const DEFAULT_USE_TYPES = [
  { value: 'WOOD_PROCESSING', label: 'Wood Processing' },
  { value: 'TREE_CUTTING', label: 'Tree Cutting' },
  { value: 'LEGAL_PURPOSES', label: 'Legal Purposes' },
  { value: 'OFFICIAL_TREE_CUTTING', label: 'Official Tree Cutting' },
  { value: 'OTHER', label: 'Other' }
];

// For SSR contexts
export const FUEL_TYPE_OPTIONS = DEFAULT_FUEL_TYPES;
export const USE_TYPE_OPTIONS = DEFAULT_USE_TYPES;
