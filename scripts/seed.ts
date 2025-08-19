import { PrismaClient, FuelType, UseType, DocType } from '../lib/generated/prisma'

// Arrays of enum values
const fuelTypes: FuelType[] = ['GAS', 'DIESEL', 'ELECTRIC', 'OTHER']
const useTypes: UseType[] = ['WOOD_PROCESSING', 'TREE_CUTTING', 'LEGAL_PURPOSES', 'OFFICIAL_TREE_CUTTING', 'OTHER']

const prisma = new PrismaClient()

const seed = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.document.deleteMany()
    await prisma.equipment.deleteMany()

    // Chainsaw brands and models
    const chainsaws = [
      { brand: 'Stihl', models: ['MS 180', 'MS 250', 'MS 381', 'MS 500i'] },
      { brand: 'Husqvarna', models: ['120 Mark II', '445', '572 XP', '390 XP'] },
      { brand: 'Echo', models: ['CS-310', 'CS-400', 'CS-590', 'CS-7310P'] },
      { brand: 'Makita', models: ['DCS6421', 'EA4300F', 'EA6100P', 'EA7900P'] },
    ]

    // Helper functions
    const randomDate = (start: Date, end: Date) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    const generateSerialNumber = () => {
      return Math.random().toString(36).substring(2, 6).toUpperCase() +
        Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    }

    console.log('Creating chainsaw entries...')

    // Create 50 chainsaws
    for (let i = 0; i < 50; i++) {
      const randomBrand = chainsaws[Math.floor(Math.random() * chainsaws.length)]
      const randomModel = randomBrand.models[Math.floor(Math.random() * randomBrand.models.length)]

      // Random dates within the last 2.5 years
      const endDate = new Date()
      const startDate = new Date(endDate.getFullYear() - 2.5, endDate.getMonth(), endDate.getDate())
      const dateAcquired = randomDate(startDate, endDate)

      const equipment = await prisma.equipment.create({
        data: {
          // Owner Information
          ownerFirstName: `Owner${i + 1}`,
          ownerLastName: `Smith${i + 1}`,
          ownerMiddleName: `M${i + 1}`,
          ownerAddress: `${Math.floor(Math.random() * 9999) + 1} Main St, City ${i + 1}`,
          ownerContactNumber: `+63${Math.floor(Math.random() * 900000000) + 100000000}`,
          ownerEmail: `owner${i + 1}@example.com`,
          ownerPreferContactMethod: Math.random() > 0.5 ? 'PHONE' : 'EMAIL',
          ownerIdUrl: `https://example.com/ids/owner${i + 1}.jpg`,

          // Equipment Information
          brand: randomBrand.brand,
          model: randomModel,
          serialNumber: generateSerialNumber(),
          guidBarLength: Math.floor(Math.random() * 10) + 16, // 16-25 inches
          horsePower: parseFloat((Math.random() * 4 + 2).toFixed(1)), // 2-6 HP
          fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
          dateAcquired,
          stencilOfSerialNo: `ST-${generateSerialNumber()}`,
          otherInfo: 'Regular inspection completed',
          intendedUse: useTypes[Math.floor(Math.random() * useTypes.length)],
          isNew: Math.random() > 0.3, // 70% chance of being new
          documents: {
            create: [
              {
                type: DocType.REGISTRATION_APPLICATION,
                fileUrl: `https://example.com/docs/${generateSerialNumber()}/registration.pdf`,
                uploadedAt: dateAcquired
              },
              {
                type: DocType.CHAINSAW_PICTURE,
                fileUrl: `https://example.com/docs/${generateSerialNumber()}/picture.jpg`,
                uploadedAt: dateAcquired
              }
            ]
          }
        }
      })

      console.log(`Created chainsaw: ${equipment.brand} ${equipment.model}`)
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
