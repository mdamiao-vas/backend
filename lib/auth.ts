import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//import { cookies } from 'next/headers';
//import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Hash password
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT
export function generateToken(payload: string | object | Buffer<ArrayBufferLike>) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

// Verify JWT
export function verifyToken(token: string ) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}

// Probably not needed?
/*
export async function verifyAuth() {
    const cookieStore = cookies()  
    // To get the 'api-token' cookie
    const apiToken = (await cookieStore).get('api-token')
    
    if (apiToken) {
      console.log('API Token:', apiToken.value)
      // Use the apiToken.value as needed
    } else {
      return NextResponse.json(
              { error: 'Unauthorized' },
              { status: 401 }
            );
    }
  
  // Authenticate user
  const user = verifyToken(apiToken.value);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
  */