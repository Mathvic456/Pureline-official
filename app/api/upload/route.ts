import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const filename = `${uuidv4()}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    const filepath = `products/${filename}`

    const adminClient = getAdminClient()

    // Upload to Supabase Storage
    const { error } = await adminClient.storage.from("product_images").upload(filepath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("[v0] Supabase storage error:", error)
      return NextResponse.json({ error: `Failed to upload image: ${error.message}` }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = adminClient.storage.from("product_images").getPublicUrl(filepath)

    if (!publicUrl) {
      return NextResponse.json({ error: "Failed to generate public URL" }, { status: 500 })
    }

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred during upload"
    console.error("[v0] Upload error:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
