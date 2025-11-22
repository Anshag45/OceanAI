import { aiService } from "@/lib/services/ai-service"
import { verifyToken } from "@/lib/auth"

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

    const { testType = "text", useMock = false } = await request.json()

    // Temporarily enable/disable mock mode for testing
    const previousMode = aiService["useMock"]
    aiService.setMockMode(useMock)

    try {
      const prompts: Record<string, string> = {
        text: "Write a short professional greeting for a business email.",
        outline: "Generate 5 section titles for a business document. Format as a JSON array of strings only.",
        refinement: "Refine this text: 'Our product is good and helps people.' Make it more professional.",
      }

      const content = await aiService.generateContent(
        {
          prompt: prompts[testType] || prompts.text,
          maxTokens: 500,
        },
        payload.userId,
      )

      return Response.json({
        success: true,
        testType,
        usedMock: useMock,
        content,
        timestamp: new Date().toISOString(),
      })
    } finally {
      aiService.setMockMode(previousMode)
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
