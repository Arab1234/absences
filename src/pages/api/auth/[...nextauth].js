import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

const prisma = new PrismaClient()

 const authOptions =NextAuth({
    
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session:{
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60,
    csrf: {
      useSession: true
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  callbacks: {async jwt({ token, account }) {
    // Persist the OAuth access_token to the token right after signin
    if (account) {
      token.accessToken = account.access_token
    }
    return token
  },
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
    session.accessToken = token.accessToken;
    session.csrfToken = randomCsrfTokenGenerator();
    return session
  }
},
jwt: {
  secret:process.env.NEXTAUTH_SECRET,
  maxAge: 60 * 60, // 30 days
},
  pages:{
    signIn:"../../login"
  }
})

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function randomCsrfTokenGenerator() {
  const tokenLength = 32; // Adjust the length as needed
  return generateRandomString(tokenLength);
}

const handler = NextAuth(authOptions);

export default authOptions