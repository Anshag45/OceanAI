import { createUser, getUser } from "@/lib/db"
import { createToken } from "@/lib/auth"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ message: "Email and password are required" }, { status: 400 })
    }

    const existingUser = await getUser(email)
    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 409 })
    }

    const passwordHash = await hash(password, 10)
    const user = await createUser(email, passwordHash)
    const token = await createToken(user.id)

    return Response.json({ token, user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ message: "Registration failed" }, { status: 500 })
  }
}
