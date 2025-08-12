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

export function useFuelTypeOptions() {
  const [options, setOptions] = useState(DEFAULT_FUEL_TYPES);

  useEffect(() => {
    let mounted = true;

    async function fetchFuelTypes() {
      try {
        const response = await fetch('/api/fuel-types');
        const data = await response.json();

        if (mounted && data.success && Array.isArray(data.fuelTypes)) {
          const validTypes = data.fuelTypes.filter((c: { value?: string, label?: string }) => c.value && c.label);
          if (validTypes.length > 0) {
            setOptions(validTypes);
          }
        }
      } catch (error) {
        console.error('Error fetching fuel types:', error);
        // Keep defaults on error
      }
    }

    fetchFuelTypes();

    return () => {
      mounted = false;
    };
  }, []);

  return options;
}

export function useUseTypeOptions() {
  const [options, setOptions] = useState(DEFAULT_USE_TYPES);

  useEffect(() => {
    let mounted = true;

    async function fetchUseTypes() {
      try {
        const response = await fetch('/api/use-types');
        const data = await response.json();

        if (mounted && data.success && Array.isArray(data.useTypes)) {
          const validTypes = data.useTypes.filter((c: { value?: string, label?: string }) => c.value && c.label);
          if (validTypes.length > 0) {
            setOptions(validTypes);
          }
        }
      } catch (error) {
        console.error('Error fetching use types:', error);
        // Keep defaults on error
      }
    }

    fetchUseTypes();

    return () => {
      mounted = false;
    };
  }, []);

  return options;
}

// For SSR contexts
export const FUEL_TYPE_OPTIONS = DEFAULT_FUEL_TYPES;
export const USE_TYPE_OPTIONS = DEFAULT_USE_TYPES;
