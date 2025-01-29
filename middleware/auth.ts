import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

interface DecodedToken {
  role: string;
  // Add other properties as needed
}

// Extend the NextRequest interface to include the user property
declare module "next/server" {
  interface NextRequest {
    user?: DecodedToken;
  }
}

export const verifyToken = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  console.log("verify Token ran.");
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>
    jwt.verify(token, process.env.NEXTAUTH_SECRET as string, (err, decoded) => {
      if (err) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
      }
      req.user = decoded as DecodedToken;
      return NextResponse.json({ error: "Success" }, { status: 200 });
    });
  } else {
    return NextResponse.json({ error: "Authentication token is missing" }, { status: 401 });
  }
};