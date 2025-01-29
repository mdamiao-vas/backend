import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  console.log("i'm in the middleware")

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url))
  }

  if (request.nextUrl.pathname.startsWith("/api/admin") && token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/users", "/api/admin/users"],
}
