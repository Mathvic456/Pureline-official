"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ProductDetailRedirect() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const id = params.id
    if (id) {
      router.replace(`/projects/${id}`)
    } else {
      router.replace("/")
    }
  }, [params, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-muted-foreground">Redirecting to project details…</p>
    </div>
  )
}
