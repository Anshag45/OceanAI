import { verifyToken } from "@/lib/auth"
import { createComment, getComments } from "@/lib/db"

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

    const comments = await getComments(id)
    return Response.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return Response.json({ message: "Error fetching comments" }, { status: 500 })
  }
}

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

    const { content } = await request.json()
    if (!content?.trim()) {
      return Response.json({ message: "Comment content required" }, { status: 400 })
    }

    const comment = await createComment(id, content)
    return Response.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return Response.json({ message: "Error creating comment" }, { status: 500 })
  }
}
