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

    const { projectId, documentType, topic } = await request.json()

    if (!topic || topic.trim().length === 0) {
      return Response.json({ message: "Topic is required" }, { status: 400 })
    }

    const prompt =
      documentType === "docx"
        ? `Generate 5 section titles for a professional business document about: "${topic}"

Return ONLY these 5 titles as a numbered list, one per line. Do not include any other text, introduction, or explanation.

Format example:
1. Introduction and Overview
2. Current Market Situation
3. Our Solution
4. Implementation Roadmap
5. Expected Outcomes and Conclusion`
        : `Generate 8 slide titles for a professional presentation about: "${topic}"

Return ONLY these 8 titles as a numbered list, one per line. Do not include any other text, introduction, or explanation.

Format example:
1. Title Slide
2. Overview and Agenda
3. Current Market Analysis
4. Problem Definition
5. Our Solution
6. Implementation Timeline
7. Results and Benefits
8. Questions and Discussion`

    console.log("[v0] Generating outline for topic:", topic, "Type:", documentType)

    const text = await aiService.generateContent(
      {
        prompt,
        maxTokens: 300,
        temperature: 0.2,
      },
      payload.userId,
    )

    console.log("[v0] Raw AI response:", text)

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    console.log("[v0] Lines after split:", lines.length, lines)

    // Extract text after number prefix (1., 1), *, -)
    const outline = lines
      .map((line) => {
        // Match lines that start with numbers or bullets
        const match = line.match(/^(?:\d+[.):\s]+|\*\s*|-\s*)(.+)$/)
        if (match && match[1]) {
          return match[1].trim()
        }
        // If line doesn't start with number/bullet but has content, return as-is
        if (line.length > 3) {
          return line
        }
        return null
      })
      .filter((item): item is string => item !== null && item.length > 0)

    console.log("[v0] Final outline items:", outline.length, outline)

    if (outline.length === 0) {
      return Response.json(
        { message: "Failed to extract outline items from AI response. Please try again." },
        { status: 500 },
      )
    }

    const expectedCount = documentType === "docx" ? 5 : 8
    if (outline.length !== expectedCount) {
      console.warn(`[v0] Expected ${expectedCount} items but got ${outline.length}. Continuing anyway.`)
    }

    return Response.json({ outline })
  } catch (error) {
    console.error("[v0] Error in suggest-outline route:", error)
    const message = error instanceof Error ? error.message : "Error generating outline"
    return Response.json({ message }, { status: 500 })
  }
}
