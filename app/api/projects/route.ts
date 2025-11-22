import { getProjects, createProject } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const payload = await verifyToken(token)

    if (!payload) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const projects = await getProjects(payload.userId)
    return Response.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return Response.json({ message: "Error fetching projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const payload = await verifyToken(token)

    if (!payload) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { documentType, topic } = await request.json()

    if (!documentType || !topic) {
      return Response.json({ message: "Document type and topic are required" }, { status: 400 })
    }

    const project = await createProject(payload.userId, documentType, topic)
    return Response.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return Response.json({ message: "Error creating project" }, { status: 500 })
  }
}
