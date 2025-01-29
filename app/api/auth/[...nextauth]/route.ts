import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

// Extend the User type
declare module "next-auth" {
  interface User {
    role: string;
  }

  interface Session {
    user: {
      role: string;
      accessToken?: string;
    };
  }

  interface JWT {
    role: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        if (!credentials?.username || !credentials?.password)
          {
            return null
          } 

        try {
                  
          const res = await axios.post(`${process.env.PUBLIC_BACKEND_URL}/api/auth/login_nextauth`, {
            email: credentials.username,
            password: credentials.password,
          })
          console.log(res);
          console.log(res.data.user);
          if (res.data.user) {
            return { ...res.data.user, role: res.data.user.role }
          }
        } catch (error) {
          console.error("Authentication error:", error)
        }
        return null
      },
    }),
  ],
  callbacks: {
    
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        // Include the access token in the session
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },

  // Use a strong, unique secret key
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }



