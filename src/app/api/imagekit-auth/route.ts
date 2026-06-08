import { NextResponse } from "next/server";
import ImageKit from "imagekit";

// Initializing using your exact .env variable names
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function GET() {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    
    // We send the parameters PLUS the keys the client needs to initialize
    return NextResponse.json({
      ...authenticationParameters,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to authenticate with ImageKit" }, { status: 500 });
  }
}