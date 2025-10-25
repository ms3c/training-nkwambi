import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://submissions.yetumotion.com/requests", {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json(
      { error: "Failed to fetch reservations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
