import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional)
  await prisma.lead.deleteMany({});
  
  // Create seed records
  const seedData = [
    {
      name: 'James Wilson',
      email: 'james.wilson@gmail.com',
      mobile: '0412 345 678',
      postcode: '2060',
      services: ['delivery', 'payment']
    },
    {
      name: 'Sophie Taylor',
      email: 'sophie.taylor@outlook.com',
      mobile: '0423 789 456',
      postcode: '3143',
      services: ['pick-up', 'payment']
    },
    {
      name: 'Liam Nguyen',
      email: 'liam.nguyen@hotmail.com',
      mobile: '0437 654 321',
      postcode: '4000',
      services: ['delivery', 'pick-up', 'payment']
    }
  ];
  
  console.log('Starting to seed the database...');
  
  for (const data of seedData) {
    const lead = await prisma.lead.create({
      data
    });
    console.log(`Created lead with ID: ${lead.id}`);
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });