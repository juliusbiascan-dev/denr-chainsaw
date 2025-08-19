import * as z from "zod";

export const FuelType = z.enum(["GAS", "DIESEL", "ELECTRIC", "OTHER"]);
export const UseType = z.enum(["WOOD_PROCESSING", "TREE_CUTTING", "LEGAL_PURPOSES", "OFFICIAL_TREE_CUTTING", "OTHER"]);

export const EquipmentSchema = z.object({
  // Owner Information
  ownerFirstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }).max(50, {
    message: "First name must not exceed 50 characters."
  }).trim(),
  ownerLastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }).max(50, {
    message: "Last name must not exceed 50 characters."
  }).trim(),
  ownerMiddleName: z.string().min(2, {
    message: "Middle name must be at least 2 characters.",
  }).max(50, {
    message: "Middle name must not exceed 50 characters."
  }).trim(),
  ownerAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }).max(200, {
    message: "Address must not exceed 200 characters."
  }).trim(),
  ownerContactNumber: z.string().optional(),
  ownerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal("")),
  ownerPreferContactMethod: z.string().optional(),
  ownerIdUrl: z.string().optional(),

  // Equipment Information
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
