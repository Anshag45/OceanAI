import { aiService } from "@/lib/services/ai-service"
import { verifyToken } from "@/lib/auth"
import { updateSection } from "@/lib/db"

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

    const { sectionId, sectionTitle, projectTopic } = await request.json()

    if (!sectionId || !sectionTitle || !projectTopic) {
      return Response.json({ message: "Missing required fields" }, { status: 400 })
    }

    const content = await aiService.generateContent(
      {
        prompt: `Write a comprehensive, professional section for a business document about "${projectTopic}" with the section title "${sectionTitle}". 

Requirements:
- Write between 150-300 words
- Use clear, professional language
- Organize with logical paragraphs
- Focus on practical insights and actionable information
- No markdown formatting, just plain text

Content:`,
        maxTokens: 1000,
        temperature: 0.7,
      },
      payload.userId,
    )

    const trimmedContent = content.trim()

    await updateSection(sectionId, trimmedContent)

    return Response.json({ content: trimmedContent })
  } catch (error) {
    console.error("[v0] Error generating section:", error)
    const message = error instanceof Error ? error.message : "Error generating section"
    return Response.json({ message }, { status: 500 })
  }
}
