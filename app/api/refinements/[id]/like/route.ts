import { verifyToken } from "@/lib/auth"
import { updateRefinementLikes } from "@/lib/db"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const { liked } = await request.json()
    const result = await updateRefinementLikes(id, liked ? 1 : 0)

    return Response.json(result)
  } catch (error) {
    console.error("Error updating likes:", error)
    return Response.json({ message: "Error updating likes" }, { status: 500 })
  }
}
