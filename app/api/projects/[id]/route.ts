import { getProject, deleteProject } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

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

    const project = await getProject(id)
    return Response.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return Response.json({ message: "Error fetching project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    await deleteProject(id)
    return Response.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return Response.json({ message: "Error deleting project" }, { status: 500 })
  }
}
