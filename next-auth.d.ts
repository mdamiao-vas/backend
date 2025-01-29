import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
      email: string
      role: string
      accessToken: string
    }
    expiresAt: number
  }

  interface User {
    role: string
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    accessToken: string
    expiresAt: number
  }
}
