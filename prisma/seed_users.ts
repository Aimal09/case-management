import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const defaultPassword = await bcrypt.hash('password123', 10);
    const users = [
        {
        name: 'Admin User',
        email: 'admin@user.com',
        password: defaultPassword,
        role: 'Admin',
        designation: 'Admin',
        contact: ''
        },
        {
        name: 'Saddam Hussein Memon',
        email: 'saddam.dd@user.com',
        password: defaultPassword,
        role: 'DD',
        designation: 'Deputy Director',
        contact: ''
        },
        {
        name: 'Assistant Commissioner Naushahro Feroze',
        email: 'ac.naushahroferoze@user.com',
        password: defaultPassword,
        role: 'AC',
        designation: 'Assistant Commissioner',
        contact: ''
        },
        {
        name: 'Assistant Commissioner Mehrabpur',
        email: 'ac.mehrabpur@user.com',
        password: defaultPassword,
        role: 'AC',
        designation: 'Assistant Commissioner',
        contact: ''
        },
        {
        name: 'Assistant Commissioner Bhiria',
        email: 'ac.bhiria@user.com',
        password: defaultPassword,
        role: 'AC',
        designation: 'Assistant Commissioner',
        contact: ''
        },
        {
        name: 'Assistant Commissioner Moro',
        email: 'ac.moro@user.com',
        password: defaultPassword,
        role: 'AC',
        designation: 'Assistant Commissioner',
        contact: ''
        },
        {
        name: 'Assistant Commissioner Kandiaro',
        email: 'ac.kandiaro@user.com',
        password: defaultPassword,
        role: 'AC',
        designation: 'Assistant Commissioner',
        contact: ''
        },
        {
        name: 'Mukhtiarkar Naushahro Feroze',
        email: 'mukhtiarkar.naushahroferoze@user.com',
        password: defaultPassword,
        role: 'Mukhtiarkar',
        designation: 'Mukhtiarkar',
        contact: ''
        },
        {
        name: 'Mukhtiarkar Mehrabpur',
        email: 'mukhtiarkar.mehrabpur@user.com',
        password: defaultPassword,
        role: 'Mukhtiarkar',
        designation: 'Mukhtiarkar',
        contact: ''
        },
        {
        name: 'Mukhtiarkar Bhiria',
        email: 'mukhtiarkar.bhiria@user.com',
        password: defaultPassword,
        role: 'Mukhtiarkar',
        designation: 'Mukhtiarkar',
        contact: ''
        },
        {
        name: 'Mukhtiarkar Moro',
        email: 'mukhtiarkar.moro@user.com',
        password: defaultPassword,
        role: 'Mukhtiarkar',
        designation: 'Mukhtiarkar',
        contact: ''
        },
        {
        name: 'Mukhtiarkar Kandiaro',
        email: 'mukhtiarkar.kandiaro@user.com',
        password: defaultPassword,
        role: 'Mukhtiarkar',
        designation: 'Mukhtiarkar',
        contact: ''
        },
        {
        name: 'Mukhtiarkar/Incharge Evacuee Property',
        email: 'mukhtiarkar.evacuee@user.com',
        password: defaultPassword,
        role: 'Mukhtiarkar',
        designation: 'Mukhtiarkar/Incharge Evacuee Property',
        contact: ''
        },
        {
        name: 'Mukhtiarkar barrage',
        email: 'mukhtiarkar.barrage@user.com',
        password: defaultPassword,
        role: 'Mukhtiarkar',
        designation: 'Mukhtiarkar barrage',
        contact: ''
        }
    ];
    
    await prisma.user.deleteMany({});

    for (const user of users) {
        await prisma.user.create({
          data: user
        });
      }

  console.log('Users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });