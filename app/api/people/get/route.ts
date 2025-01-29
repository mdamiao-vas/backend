import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from "@/middleware/auth"

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {

   // Authenticate user
    const user = verifyToken(request);

    console.log(user)
        
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }


     try {
      const people = await prisma.person.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });

      return NextResponse.json(people,{ status: 200 });
    
     } catch (err) {
       console.error('Failed to fetch people:', err);
       return NextResponse.json(
         { error: 'Failed to fetch people' },
         { status: 500 }
       );
     }     
 
  
}