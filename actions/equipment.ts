"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { EquipmentSchema } from "@/schemas/equipment";
import { createEquipment, updateEquipment, deleteEquipment, getEquipmentById } from "@/data/equipment";

export const createEquipmentAction = async (values: z.infer<typeof EquipmentSchema>) => {
  // Validate input
  const validatedFields = EquipmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    // Owner Information
    ownerFirstName,
    ownerMiddleName,
    ownerLastName,
    ownerAddress,
    ownerContactNumber,
    ownerEmail,
    ownerPreferContactMethod,
    ownerIdUrl,
    // Chainsaw Information
    brand,
    model,
    serialNumber,
    guidBarLength,
    horsePower,
    fuelType,
    dateAcquired,
    stencilOfSerialNo,
    otherInfo,
    intendedUse,
    isNew,
    // Document Requirements
    registrationApplicationUrl,
    officialReceiptUrl,
    spaUrl,
    stencilSerialNumberPictureUrl,
    chainsawPictureUrl,
    // Additional Requirements
    forestTenureAgreementUrl,
    businessPermitUrl,
    certificateOfRegistrationUrl,
    lguBusinessPermitUrl,
    woodProcessingPermitUrl,
    governmentCertificationUrl,
    // Data Privacy Consent
    dataPrivacyConsent
  } = validatedFields.data;

  try {
    const result = await createEquipment({
      // Owner Information
      ownerFirstName,
      ownerMiddleName,
      ownerLastName,
      ownerAddress,
      ownerContactNumber,
      ownerEmail,
      ownerPreferContactMethod,
      ownerIdUrl,
      // Chainsaw Information
      brand,
      model,
      serialNumber,
      guidBarLength,
      horsePower,
      fuelType,
      dateAcquired,
      stencilOfSerialNo,
      otherInfo,
      intendedUse,
      isNew,
      // Document Requirements
      registrationApplicationUrl,
      officialReceiptUrl,
      spaUrl,
      stencilSerialNumberPictureUrl,
      chainsawPictureUrl,
      // Additional Requirements
      forestTenureAgreementUrl,
      businessPermitUrl,
      certificateOfRegistrationUrl,
      lguBusinessPermitUrl,
      woodProcessingPermitUrl,
      governmentCertificationUrl,
      // Data Privacy Consent
      dataPrivacyConsent
    });

    if (result.success) {
      revalidatePath("/dashboard/equipments");
      return { success: result.message };
    } else {
      return { error: result.message };
    }
  } catch (error) {
    console.error("Equipment creation error:", error);
    return { error: "Something went wrong!" };
  }
};

export const updateEquipmentAction = async (
  id: string,
  values: z.infer<typeof EquipmentSchema>
) => {
  // Validate input
  const validatedFields = EquipmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    // Owner Information
    ownerFirstName,
    ownerMiddleName,
    ownerLastName,
    ownerAddress,
    ownerContactNumber,
    ownerEmail,
    ownerPreferContactMethod,
    ownerIdUrl,
    // Chainsaw Information
    brand,
    model,
    serialNumber,
    guidBarLength,
    horsePower,
    fuelType,
    dateAcquired,
    stencilOfSerialNo,
    otherInfo,
    intendedUse,
    isNew,
    // Document Requirements
    registrationApplicationUrl,
    officialReceiptUrl,
    spaUrl,
    stencilSerialNumberPictureUrl,
    chainsawPictureUrl,
    // Additional Requirements
    forestTenureAgreementUrl,
    businessPermitUrl,
    certificateOfRegistrationUrl,
    lguBusinessPermitUrl,
    woodProcessingPermitUrl,
    governmentCertificationUrl,
    // Data Privacy Consent
    dataPrivacyConsent
  } = validatedFields.data;

  try {
    // Check if equipment exists
    const existingEquipment = await getEquipmentById(id);

    if (!existingEquipment.success) {
      return { error: "Equipment not found!" };
    }

    const result = await updateEquipment(id, {
      // Owner Information
      ownerFirstName,
      ownerMiddleName,
      ownerLastName,
      ownerAddress,
      ownerContactNumber,
      ownerEmail,
      ownerPreferContactMethod,
      ownerIdUrl,
      // Chainsaw Information
      brand,
      model,
      serialNumber,
      guidBarLength,
      horsePower,
      fuelType,
      dateAcquired,
      stencilOfSerialNo,
      otherInfo,
      intendedUse,
      isNew,
      // Document Requirements
      registrationApplicationUrl,
      officialReceiptUrl,
      spaUrl,
      stencilSerialNumberPictureUrl,
      chainsawPictureUrl,
      // Additional Requirements
      forestTenureAgreementUrl,
      businessPermitUrl,
      certificateOfRegistrationUrl,
      lguBusinessPermitUrl,
      woodProcessingPermitUrl,
      governmentCertificationUrl,
      // Data Privacy Consent
      dataPrivacyConsent
    });

    if (result.success) {
      revalidatePath("/dashboard/equipments");
      revalidatePath(`/dashboard/equipments/${id}`);
      return { success: result.message };
    } else {
      return { error: result.message };
    }
  } catch (error) {
    console.error("Equipment update error:", error);
    return { error: "Something went wrong!" };
  }
};

export const deleteEquipmentAction = async (id: string) => {
  try {
    // Check if equipment exists
    const existingEquipment = await getEquipmentById(id);

    if (!existingEquipment.success) {
      return { error: "Equipment not found!" };
    }

    const result = await deleteEquipment(id);

    if (result.success) {
      revalidatePath("/dashboard/equipments");
      return { success: result.message };
    } else {
      return { error: result.message };
    }
  } catch (error) {
    console.error("Equipment deletion error:", error);
    return { error: "Something went wrong!" };
  }
};

export const bulkImportEquipmentAction = async (equipmentsData: any[]) => {
  try {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < equipmentsData.length; i++) {
      const equipmentData = equipmentsData[i];

      try {
        // Validate the equipment data
        const validatedFields = EquipmentSchema.safeParse(equipmentData);

        if (!validatedFields.success) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Invalid fields - ${validatedFields.error.message}`);
          continue;
        }

        const {
          // Owner Information
          ownerFirstName,
          ownerMiddleName,
          ownerLastName,
          ownerAddress,
          ownerContactNumber,
          ownerEmail,
          ownerPreferContactMethod,
          ownerIdUrl,
          // Chainsaw Information
          brand,
          model,
          serialNumber,
          guidBarLength,
          horsePower,
          fuelType,
          dateAcquired,
          stencilOfSerialNo,
          otherInfo,
          intendedUse,
          isNew,
          // Document Requirements
          registrationApplicationUrl,
          officialReceiptUrl,
          spaUrl,
          stencilSerialNumberPictureUrl,
          chainsawPictureUrl,
          // Additional Requirements
          forestTenureAgreementUrl,
          businessPermitUrl,
          certificateOfRegistrationUrl,
          lguBusinessPermitUrl,
          woodProcessingPermitUrl,
          governmentCertificationUrl,
          // Data Privacy Consent
          dataPrivacyConsent
        } = validatedFields.data;

        const result = await createEquipment({
          // Owner Information
          ownerFirstName,
          ownerMiddleName,
          ownerLastName,
          ownerAddress,
          ownerContactNumber,
          ownerEmail,
          ownerPreferContactMethod,
          ownerIdUrl,
          // Chainsaw Information
          brand,
          model,
          serialNumber,
          guidBarLength,
          horsePower,
          fuelType,
          dateAcquired,
          stencilOfSerialNo,
          otherInfo,
          intendedUse,
          isNew,
          // Document Requirements
          registrationApplicationUrl,
          officialReceiptUrl,
          spaUrl,
          stencilSerialNumberPictureUrl,
          chainsawPictureUrl,
          // Additional Requirements
          forestTenureAgreementUrl,
          businessPermitUrl,
          certificateOfRegistrationUrl,
          lguBusinessPermitUrl,
          woodProcessingPermitUrl,
          governmentCertificationUrl,
          // Data Privacy Consent
          dataPrivacyConsent
        });

        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`Row ${i + 1}: ${result.message}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (results.success > 0) {
      revalidatePath("/dashboard/equipments");
    }

    return {
      success: results.success > 0,
      message: `Successfully imported ${results.success} equipment records. ${results.failed} records failed.`,
      details: {
        success: results.success,
        failed: results.failed,
        errors: results.errors
      }
    };
  } catch (error) {
    console.error("Bulk import error:", error);
    return {
      success: false,
      message: "Something went wrong during bulk import!",
      details: {
        success: 0,
        failed: equipmentsData.length,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
};

export const bulkDeleteEquipmentAction = async (equipmentIds: string[]) => {
  try {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < equipmentIds.length; i++) {
      const equipmentId = equipmentIds[i];

      try {
        // Check if equipment exists
        const existingEquipment = await getEquipmentById(equipmentId);

        if (!existingEquipment.success) {
          results.failed++;
          results.errors.push(`Equipment ID ${equipmentId}: Equipment not found`);
          continue;
        }

        const result = await deleteEquipment(equipmentId);

        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`Equipment ID ${equipmentId}: ${result.message}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Equipment ID ${equipmentId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (results.success > 0) {
      revalidatePath("/dashboard/equipments");
    }

    return {
      success: results.success > 0,
      message: `Successfully deleted ${results.success} equipment records. ${results.failed} records failed to delete.`,
      details: {
        success: results.success,
        failed: results.failed,
        errors: results.errors
      }
    };
  } catch (error) {
    console.error("Bulk delete error:", error);
    return {
      success: false,
      message: "Something went wrong during bulk delete!",
      details: {
        success: 0,
        failed: equipmentIds.length,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    };
  }
};
