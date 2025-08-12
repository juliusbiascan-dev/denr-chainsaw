import * as z from "zod";

export const FuelType = z.enum(["GAS", "DIESEL", "ELECTRIC", "OTHER"]);
export const UseType = z.enum(["WOOD_PROCESSING", "TREE_CUTTING", "LEGAL_PURPOSES", "OFFICIAL_TREE_CUTTING", "OTHER"]);

export const EquipmentSchema = z.object({
  brand: z.string().min(2, {
    message: "Brand must be at least 2 characters.",
  }).max(100, {
    message: "Brand must not exceed 100 characters."
  }).trim(),
  model: z.string().min(2, {
    message: "Model must be at least 2 characters.",
  }).max(100, {
    message: "Model must not exceed 100 characters."
  }).trim(),
  serialNumber: z.string().min(1, {
    message: "Serial number is required.",
  }),
  guidBarLength: z.number().positive({
    message: "Guide bar length must be a positive number.",
  }),
  horsePower: z.number().positive({
    message: "Horse power must be a positive number.",
  }),
  fuelType: FuelType,
  dateAcquired: z.date(),
  stencilOfSerialNo: z.string().min(1, {
    message: "Stencil of serial number is required.",
  }),
  otherInfo: z.string().min(1, {
    message: "Other information is required.",
  }),
  intendedUse: UseType,
  isNew: z.boolean()
});

export const EquipmentUpdateSchema = EquipmentSchema.partial().extend({
  id: z.string().min(1, {
    message: "Equipment ID is required.",
  }),
});
