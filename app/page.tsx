import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center gap-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">DocGen AI</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              AI-powered document generation platform. Create, refine, and export professional business documents in
              seconds.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/login">
              <Button variant="default" size="lg">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Generate</h3>
              <p className="text-muted-foreground">Create document outlines and content with AI in seconds</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Refine</h3>
              <p className="text-muted-foreground">Collaborate with AI to perfect your documents with feedback</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Export</h3>
              <p className="text-muted-foreground">Download as .docx or .pptx for immediate use</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
