import { PrismaClient, FuelType, UseType, DocType } from '../lib/generated/prisma'
import * as XLSX from 'xlsx'

const prisma = new PrismaClient()

// Helper function to convert Excel date to JavaScript Date
const excelDateToJSDate = (excelDate: number): Date => {
  // Excel dates are number of days since 1900-01-01
  const utcDays = Math.floor(excelDate - 25569)
  const utcValue = utcDays * 86400
  return new Date(utcValue * 1000)
}

// Helper function to map fuel type
const mapFuelType = (fuel: string): FuelType => {
  const fuelLower = fuel.toLowerCase()
  if (fuelLower.includes('gas')) return 'GAS'
  if (fuelLower.includes('diesel')) return 'DIESEL'
  if (fuelLower.includes('electric')) return 'ELECTRIC'
  return 'OTHER'
}

// Helper function to map intended use
const mapIntendedUse = (use: string): UseType => {
  const useLower = use.toLowerCase()
  if (useLower.includes('wood processing')) return 'WOOD_PROCESSING'
  if (useLower.includes('private plantation')) return 'TREE_CUTTING_PRIVATE_PLANTATION'
  if (useLower.includes('government') || useLower.includes('legal')) return 'GOVT_LEGAL_PURPOSES'
  if (useLower.includes('barangay')) return 'OFFICIAL_TREE_CUTTING_BARANGAY'
  if (useLower.includes('business') || useLower.includes('commercial')) return 'WOOD_PROCESSING'
  if (useLower.includes('personal')) return 'OTHER'
  return 'OTHER'
}

// Helper function to map contact preference
const mapContactPreference = (preference: string): string => {
  const prefLower = preference.toLowerCase()
  if (prefLower.includes('email')) return 'EMAIL'
  if (prefLower.includes('phone')) return 'PHONE'
  return 'EMAIL' // default
}

const seed = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.document.deleteMany()
    await prisma.equipment.deleteMany()

    // Read the Excel file
    console.log('Reading Excel file...')
    const workbook = XLSX.readFile('documents/Chainsaw-Registration-Alaminos-Responses-25.xlsx')
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)

    console.log(`Found ${data.length} records in Excel file`)

    // Process each record
    for (let i = 0; i < data.length; i++) {
      const record = data[i] as any

      try {
        // Skip records without essential data
        if (!record['First Name'] || !record['Last Name'] || !record['Chainsaw Brand'] || !record['Chainsaw Model']) {
          console.log(`Skipping record ${i + 1}: Missing essential data`)
          continue
        }

        // Parse dates
        const dateAcquired = record['Date of Acquisition']
          ? excelDateToJSDate(record['Date of Acquisition'])
          : new Date()

        // Parse timestamp for createdAt
        const createdAt = record['Timestamp']
          ? excelDateToJSDate(record['Timestamp'])
          : new Date()

        // Create equipment record
        const equipment = await prisma.equipment.create({
          data: {
            // Owner Information
            ownerFirstName: record['First Name']?.toString() || '',
            ownerMiddleName: record['Middle Initial']?.toString() || '',
            ownerLastName: record['Last Name']?.toString() || '',
            ownerAddress: record['Address'] || '',
            ownerContactNumber: record['Contact No.']?.toString() || '',
            ownerEmail: record['Email Address'] || '',
            ownerPreferContactMethod: mapContactPreference(record['Preferred Contacting Method'] || ''),
            ownerIdUrl: '', // Not available in Excel

            // Equipment Information
            brand: record['Chainsaw Brand'] || '',
            model: record['Chainsaw Model']?.toString() || '',
            serialNumber: record['Chainsaw Serial No.']?.toString() || '',
            guidBarLength: record['Guide Bar Length (inches)'] ? parseFloat(record['Guide Bar Length (inches)']) : null,
            horsePower: record['Horse Power'] ? parseFloat(record['Horse Power']) : null,
            fuelType: mapFuelType(record['Fuel '] || ''),
            dateAcquired,
            stencilOfSerialNo: record['Stencil of Serial No.']?.toString() || '',
            otherInfo: record['Other Info of the Chainsaw (Description, Color, etc.)'] || '',
            intendedUse: mapIntendedUse(record['Intended Use of the Chainsaw'] || ''),
            isNew: record['New Chainsaw or renewal of registration?']?.toLowerCase().includes('new') || false,
            createdAt,
            updatedAt: createdAt,
            // Document URLs
            registrationApplicationUrl: record['Signed Chainsaw Registration Application'] || null,
            officialReceiptUrl: record['Official Receipt of the Chainsaw'] || null,
            stencilSerialNumberPictureUrl: record['Stencil Serial Number of Chainsaw (Picture)'] || null,
            chainsawPictureUrl: record['Picture of the Chainsaw'] || null,
            woodProcessingPermitUrl: record['For Wood Processor - Wood processing plant permit'] || null,
            businessPermitUrl: record['Business Permit (If Business owner)'] || record['Business Permit from LGU or affidavit that the chainsaw\nis needed if applicants/profession/work and will be used for legal purpose'] || null,

            // Data Privacy Consent
            dataPrivacyConsent: record['Data Privacy Act Consent:\n\nIn submitting this form I agree to my details being used for the purposes of Chainsaw Registration. The information will only be accessed by DENR Staff. I understand my data will be held securely and will not be distributed to third parties. ']?.toLowerCase().includes('agree') || false,

            // Create documents
            documents: {
              create: [
                // Registration Application
                ...(record['Signed Chainsaw Registration Application'] ? [{
                  type: DocType.REGISTRATION_APPLICATION,
                  fileUrl: record['Signed Chainsaw Registration Application'],
                  uploadedAt: dateAcquired
                }] : []),

                // Official Receipt
                ...(record['Official Receipt of the Chainsaw'] ? [{
                  type: DocType.OFFICIAL_RECEIPT,
                  fileUrl: record['Official Receipt of the Chainsaw'],
                  uploadedAt: dateAcquired
                }] : []),

                // Serial Number Picture
                ...(record['Stencil Serial Number of Chainsaw (Picture)'] ? [{
                  type: DocType.SERIAL_NUMBER_PICTURE,
                  fileUrl: record['Stencil Serial Number of Chainsaw (Picture)'],
                  uploadedAt: dateAcquired
                }] : []),

                // Chainsaw Picture
                ...(record['Picture of the Chainsaw'] ? [{
                  type: DocType.CHAINSAW_PICTURE,
                  fileUrl: record['Picture of the Chainsaw'],
                  uploadedAt: dateAcquired
                }] : []),

                // Wood Processing Permit (if applicable)
                ...(record['For Wood Processor - Wood processing plant permit'] ? [{
                  type: DocType.WOOD_PROCESSOR_PERMIT,
                  fileUrl: record['For Wood Processor - Wood processing plant permit'],
                  uploadedAt: dateAcquired
                }] : []),

                // Business Permit (if applicable)
                ...((record['Business Permit (If Business owner)'] || record['Business Permit from LGU or affidavit that the chainsaw\nis needed if applicants/profession/work and will be used for legal purpose']) ? [{
                  type: DocType.BUSINESS_PERMIT,
                  fileUrl: record['Business Permit (If Business owner)'] || record['Business Permit from LGU or affidavit that the chainsaw\nis needed if applicants/profession/work and will be used for legal purpose'],
                  uploadedAt: dateAcquired
                }] : [])
              ]
            }
          }
        })

        console.log(`Created equipment: ${equipment.brand} ${equipment.model} - ${equipment.ownerFirstName} ${equipment.ownerLastName}`)
      } catch (error) {
        console.error(`Error processing record ${i + 1}:`, error)
        console.error('Record data:', record)
      }
    }

    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
