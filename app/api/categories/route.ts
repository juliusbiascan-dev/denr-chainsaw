import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const equipments = await db.equipment.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });

    // If no equipments are found, return default categories
    if (!equipments.length) {
      return NextResponse.json({
        categories: [
          { value: 'General Equipment', label: 'General Equipment' },
          { value: 'Laboratory Equipment', label: 'Laboratory Equipment' },
          { value: 'Other Equipment', label: 'Other Equipment' }
        ],
        success: true
      });
    }

    const categories = equipments.map(equipment => ({
      value: equipment.category,
      label: equipment.category
    }));

    // Remove duplicates and null/undefined values
    const uniqueCategories = Array.from(new Set(categories.map(c => JSON.stringify(c))))
      .map(str => JSON.parse(str))
      .filter(c => c.value && c.label);

    return NextResponse.json({
      categories: uniqueCategories,
      success: true
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', success: false },
      { status: 500 }
    );
  }
}
