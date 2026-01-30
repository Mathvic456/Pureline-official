"use client"

import { Suspense } from "react"
import { ConfirmContent } from "@/components/auth/confirm-content"

function ConfirmLoading() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-muted border-t-foreground" />
        </div>
        <h1 className="text-2xl font-light tracking-tight mb-2">Loading</h1>
        <p className="text-muted-foreground text-sm">Please wait...</p>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<ConfirmLoading />}>
      <ConfirmContent />
    </Suspense>
  )
}
