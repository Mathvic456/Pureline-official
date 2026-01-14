"use client"

import { Suspense } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmContent } from "@/components/auth/confirm-content"

function ConfirmLoading() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
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
