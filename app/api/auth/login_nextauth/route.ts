import { PrismaClient } from '@prisma/client';
import { generateToken, verifyPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("I got here");
  if (req.method !== 'POST') {
    console.log(req.method);
    console.log("Not post!");
    return NextResponse.json(
      { error: `Method ${req.method} Not Allowed` },
      { status: 405 }
    );
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {

      console.log("I failed here");

      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.users.findUnique({ where: { email } });
   
    console.log(user);
    
    if (!user || !(await verifyPassword(password, user.password))) {
      console.log('Invalid credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }    
    
    // Generate authentication token
    const token = generateToken({ id: user.id, email: user.email });

    const userWithToken = {
      ...user,
      token
    };

    // Given incoming request /home
    const response = NextResponse.json({userWithToken}, { status: 200 });

    // Return token in the response
    return response;

  } catch (error) {
    console.error('Error in authentication:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
