import { type NextRequest,NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from "@/lib/auth";
import { verifyToken } from "@/middleware/auth"

export async function GET(request: NextRequest) {
 
  try {
    // Authenticate user
    const response = verifyToken(request);

    if (response === undefined) {
      return NextResponse.json({ error: "No token found" }, { status: 400 })
    }

    if (response.status != 200) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }

    try {
      const users = await prisma.users.findMany({
        orderBy: {
          created_at: 'desc',
        },
      });

      return NextResponse.json(users, { status: 200 });
   
    } catch (err) {
      console.error('Failed to fetch users:', err);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }     

  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {

  // Authenticate user
  const user = verifyToken(request);
      
  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
  }


  try {
    const body = await request.json();
    const { user_name, name, password, email } = body;

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

     // Hash the password securely
     const hashedPassword = await hashPassword(password);

     console.log(hashedPassword);

     // Create the user object
     const data = {
       user_name,
       name,
       password: hashedPassword,
       email,
       role_id: role.id
     };    

    const user = await prisma.users.create({ data });

    console.log("I got here user");
    console.log(user);

    return NextResponse.json(user);
  } catch (err) {
    console.error('Failed to create user:', err);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}