import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

// MongoDB client with SSL configuration
const client = new MongoClient(process.env.MONGODB_URI!, {
  ssl: true,
  tlsAllowInvalidCertificates: true,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    await client.connect()
    const db = client.db('AlunguAi')
    const usersCollection = db.collection('Users')
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase()
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      image: null,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)

    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: result.insertedId
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
