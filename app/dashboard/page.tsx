"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectModal } from "@/components/create-project-modal"
import { ProtectedRoute } from "@/components/protected-route"
import { getToken, removeToken } from "@/lib/client-auth"
import { Plus, LogOut, Sparkles, BookOpen } from "lucide-react"

interface Project {
  id: string
  topic: string
  document_type: "docx" | "pptx"
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = getToken()
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      } else if (res.status === 401) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    removeToken()
    router.push("/")
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">DocGen AI</h1>
              </div>
              <p className="text-lg text-muted-foreground">Your AI-powered document projects</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="mt-4 md:mt-0 gap-2 w-full md:w-auto bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Create New Project Button */}
          <div className="mb-8">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 px-6 flex items-center gap-2 text-base"
              size="lg"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-5 h-5" />
              Create New Project
            </Button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-12 text-center border-2 border-dashed border-border">
              <div className="mb-4">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground">No projects yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create your first document project to get started with AI-powered generation and refinement
              </p>
              <Button onClick={() => setShowModal(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  topic={project.topic}
                  documentType={project.document_type}
                  createdAt={project.created_at}
                  onDelete={fetchProjects}
                />
              ))}
            </div>
          )}
        </div>

        {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onProjectCreated={fetchProjects} />}
      </main>
    </ProtectedRoute>
  )
}
