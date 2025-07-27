import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient } from 'mongodb'

import bcrypt from 'bcryptjs'

// MongoDB client with SSL configuration
const client = new MongoClient(process.env.MONGODB_URI!, {
  ssl: true,
  tlsAllowInvalidCertificates: true,
})
const clientPromise = client.connect()

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'AlunguAi',
    collections: {
      Users: 'Users',
      Accounts: 'Accounts', 
      Sessions: 'Sessions',
      VerificationTokens: 'VerificationTokens',
    }
  }),
  providers: [
   GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  
}),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db('AlunguAi')
          const user = await db.collection('Users').findOne({
            email: credentials.email.toLowerCase()
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
async jwt({ token, user }) {
  if (user) {
    token.sub = user.id || (user as any)._id?.toString() || token.sub;
    token.id = user.id || (user as any)._id?.toString() || token.id;
  }
  return token;
},
async session({ session, token }) {
  if (session.user && token.id) {
    session.user.id = token.id as string;
  }
  return session;
},
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
