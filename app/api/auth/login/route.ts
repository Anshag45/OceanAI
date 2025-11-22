import { getUser } from "@/lib/db"
import { createToken } from "@/lib/auth"
import { compare } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = await getUser(email)
    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const passwordMatch = await compare(password, user.password_hash)
    if (!passwordMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = await createToken(user.id)
    return Response.json({ token, user: { id: user.id, email: user.email } })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ message: "Login failed" }, { status: 500 })
  }
}
