import { verifyToken } from "@/lib/auth"
import { updateRefinementDislikes } from "@/lib/db"

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

    const { disliked } = await request.json()
    const result = await updateRefinementDislikes(id, disliked ? 1 : 0)

    return Response.json(result)
  } catch (error) {
    console.error("Error updating dislikes:", error)
    return Response.json({ message: "Error updating dislikes" }, { status: 500 })
  }
}
