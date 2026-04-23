import { Token } from "@/type";
import { formDataToJson } from "@/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.formData()
    const { refresh_token: refreshToken } = formDataToJson(body)

    const redirect_uri = `${request.nextUrl.origin}/callback`

    try {
        const { data: token } = await axios.post<Token>("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID as string,
            client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            redirect_uri,
        })

        return NextResponse.json(token)
    } catch (error) {
        console.error("Token refresh error:", error);
        return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 })
    }
}