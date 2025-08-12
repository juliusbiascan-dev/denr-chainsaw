const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  // Clear existing data
  await prisma.document.deleteMany();
  await prisma.equipment.deleteMany();

  // Chainsaw brands and their typical models
  const chainsaws = [
    { brand: 'Stihl', models: ['MS 180', 'MS 250', 'MS 381', 'MS 500i'] },
    { brand: 'Husqvarna', models: ['120 Mark II', '445', '572 XP', '390 XP'] },
    { brand: 'Echo', models: ['CS-310', 'CS-400', 'CS-590', 'CS-7310P'] },
    { brand: 'Makita', models: ['DCS6421', 'EA4300F', 'EA6100P', 'EA7900P'] },
  ];

  // Generate random date between start and end date
  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  // Generate random serial number
  const generateSerialNumber = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase() +
      Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  };

  // Create 50 chainsaws
  for (let i = 0; i < 50; i++) {
    const randomBrand = chainsaws[Math.floor(Math.random() * chainsaws.length)];
    const randomModel = randomBrand.models[Math.floor(Math.random() * randomBrand.models.length)];

    // Random dates within the last 2.5 years
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear() - 2.5, endDate.getMonth(), endDate.getDate());
    const dateAcquired = randomDate(startDate, endDate);

    // Random specifications
    const equipment = await prisma.equipment.create({
      data: {
        brand: randomBrand.brand,
        model: randomModel,
        serialNumber: generateSerialNumber(),
        guidBarLength: Math.floor(Math.random() * 10) + 16, // 16-25 inches
        horsePower: parseFloat((Math.random() * 4 + 2).toFixed(1)), // 2-6 HP
        fuelType: ['GAS', 'DIESEL', 'ELECTRIC', 'OTHER'][Math.floor(Math.random() * 4)] as 'GAS' | 'DIESEL' | 'ELECTRIC' | 'OTHER',
        dateAcquired,
        stencilOfSerialNo: `ST-${generateSerialNumber()}`,
        otherInfo: 'Regular inspection completed',
        intendedUse: ['WOOD_PROCESSING', 'TREE_CUTTING', 'LEGAL_PURPOSES', 'OFFICIAL_TREE_CUTTING', 'OTHER'][Math.floor(Math.random() * 5)] as 'WOOD_PROCESSING' | 'TREE_CUTTING' | 'LEGAL_PURPOSES' | 'OFFICIAL_TREE_CUTTING' | 'OTHER',
        isNew: Math.random() > 0.3, // 70% chance of being new
        createdAt: dateAcquired,
        updatedAt: new Date(),
        documents: {
          create: [
            {
              type: 'REGISTRATION_APPLICATION',
              fileUrl: `https://example.com/docs/${generateSerialNumber()}/registration.pdf`,
              uploadedAt: dateAcquired
            },
            {
              type: 'CHAINSAW_PICTURE',
              fileUrl: `https://example.com/docs/${generateSerialNumber()}/picture.jpg`,
              uploadedAt: dateAcquired
            }
          ]
        }
      }
    });

    console.log(`Created chainsaw: ${equipment.brand} ${equipment.model}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
