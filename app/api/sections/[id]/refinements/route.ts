import { verifyToken } from "@/lib/auth"
import { getRefinements } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const payload = await verifyToken(token)
    if (!payload) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const refinements = await getRefinements(id)
    return Response.json(refinements)
  } catch (error) {
    console.error("Error fetching refinements:", error)
    return Response.json({ message: "Error fetching refinements" }, { status: 500 })
  }
}
