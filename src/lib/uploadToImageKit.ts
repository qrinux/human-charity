import ImageKit from "imagekit-javascript";
import imageCompression from "browser-image-compression";

export async function uploadToImageKit(file: File): Promise<string> {
  // 1. Compress the image to keep payload sizes small
  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  
  const compressedFile = await imageCompression(file, compressionOptions);

  // 2. Fetch the auth tokens and the configuration keys from your API route
  const authResponse = await fetch("/api/imagekit-auth");
  if (!authResponse.ok) throw new Error("Authentication failed");
  const authData = await authResponse.json();

  // 3. Initialize the client SDK dynamically using the keys sent from the server
  const imagekitClient = new ImageKit({
    publicKey: authData.publicKey,
    urlEndpoint: authData.urlEndpoint,
  });

  // 4. Upload directly to ImageKit from the user's browser
  const uploadResult = await imagekitClient.upload({
    file: compressedFile,
    fileName: file.name,
    token: authData.token,
    expire: authData.expire,
    signature: authData.signature,
  });

  // Return the secure URL string
  return uploadResult.url;
}