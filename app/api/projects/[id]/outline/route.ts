import { createSection, getSections } from "@/lib/db"
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

    const sections = await getSections(id)
    return Response.json(sections)
  } catch (error) {
    console.error("Error fetching sections:", error)
    return Response.json({ message: "Error fetching sections" }, { status: 500 })
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

    const { sections } = await request.json()
    if (!Array.isArray(sections) || sections.length === 0) {
      return Response.json({ message: "Sections are required" }, { status: 400 })
    }

    const createdSections = []
    for (let i = 0; i < sections.length; i++) {
      const section = await createSection(id, i, sections[i])
      createdSections.push(section)
    }

    return Response.json(createdSections, { status: 201 })
  } catch (error) {
    console.error("Error creating sections:", error)
    return Response.json({ message: "Error creating sections" }, { status: 500 })
  }
}
