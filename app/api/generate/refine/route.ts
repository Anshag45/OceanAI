import { aiService } from "@/lib/services/ai-service"
import { verifyToken } from "@/lib/auth"
import { createRefinement } from "@/lib/db"

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

    const { sectionId, currentContent, refinementPrompt } = await request.json()

    if (!sectionId || !currentContent || !refinementPrompt) {
      return Response.json({ message: "Missing required fields" }, { status: 400 })
    }

    const refinedContent = await aiService.generateContent(
      {
        prompt: `Here is current content:\n\n${currentContent}\n\nUser request: ${refinementPrompt}\n\nPlease refine the content based on the user's request while maintaining professional quality.`,
        maxTokens: 2000,
      },
      payload.userId,
    )

    const refinement = await createRefinement(sectionId, refinementPrompt, refinedContent)

    return Response.json({ refinement, content: refinedContent })
  } catch (error) {
    console.error("[v0] Error refining section:", error)
    const message = error instanceof Error ? error.message : "Error refining section"
    return Response.json({ message }, { status: 500 })
  }
}
