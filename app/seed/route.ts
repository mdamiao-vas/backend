import { hashPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  


  try {
    const admin = await prisma.roles.upsert({
      where: { role: 'admin' },
      update: {},
      create: {
        role: 'admin',
      }
    });
    console.log('Admin role created/confirmed:', admin);
  } catch (error) {
    console.error('Error upserting admin role:', error);
  }


  try {
    const user = await prisma.roles.upsert({
      where: { role: 'user' },
      update: {},
      create: {
        role: 'user',
      }
    });
    console.log('User role created/confirmed:', user);
  } catch (error) {
    console.error('Error upserting user role:', error);
  }

  try {

    const role = await prisma.roles.findUnique({
          where: {
            role: 'user'
          },
          select: {
            id: true
          }
        });
    
        if (!role) {
          throw new Error('Role not found creating user');
        }

    const Adminuser = await prisma.users.create({
      data: {
        user_name: 'admin',
        name: 'MeAdmin',
        email: 'Admin@example.com',
        password: await hashPassword('hashedPassword'), // Remember to hash passwords!
        role: {
          connect: {
            id: role.id // Or whatever role ID you want to assign
          }
        }
      }
    });
    console.log('Admin user created/confirmed:', Adminuser);
  } catch (error) {
    console.error('Error upserting admin user:', error);
  }


  try {

    const role = await prisma.roles.findUnique({
          where: {
            role: 'user'
          },
          select: {
            id: true
          }
        });
    
        if (!role) {
          throw new Error('Role not found creating user');
        }

    const Adminuser = await prisma.users.create({
      data: {
        user_name: 'user',
        name: 'MeUser',
        email: 'user@example.com',
        password: await hashPassword('hashedPassword'), // Remember to hash passwords!
        role: {
          connect: {
            id: role.id // Or whatever role ID you want to assign
          }
        }
      }
    });
    console.log('Admin user created/confirmed:', Adminuser);
  } catch (error) {
    console.error('Error upserting admin user:', error);
  }



}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })