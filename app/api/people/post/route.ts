import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from "@/middleware/auth"
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {

// Authenticate user
    const user = verifyToken(request);
        
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }


   try {
    const body = await request.json();
    const { name, age, email, address, occupation } = body;

    const person = await prisma.person.create({
      data: {
        name,
        age: parseInt(age),
        email,
        address,
        occupation,
      },
    });

    return NextResponse.json(person,{ status: 200 });
  
   } catch (err) {
     console.error('Failed to fetch person:', err);
     return NextResponse.json(
       { error: 'Failed to fetch person' },
       { status: 500 }
     );
   }     



}

