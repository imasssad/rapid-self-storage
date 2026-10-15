// Photo uploads from the admin panel.
// - On Vercel (Blob store connected): the client-upload flow. The browser asks this route for a short-lived
//   token, then uploads straight to the private Blob store, so large photos never pass through a function.
// - Local development (.data/ folder): the browser posts the file here and it's written to .data/media/.
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { AuthError, requireUserFor } from "@/lib/auth";
import { isPhotoType, MAX_PHOTO_BYTES, MEDIA_PATH, mediaPathFor, PHOTO_TYPES, sniffPhotoType } from "@/lib/media";
import { storageMode, writeFile } from "@/lib/storage";

// Runs on the Node.js runtime (the default; the `runtime` segment option is not allowed with Cache Components).

const error = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

/** CSRF protection for this mutating route handler: the request must come from this site. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return error("This request didn't come from the admin panel.", 403);

  try {
    if (storageMode() === "local") {
      await requireUserFor("any");
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return error("Choose a photo to upload.");
      if (file.size > MAX_PHOTO_BYTES) return error("That photo is over 8 MB. Use a smaller one.");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const type = sniffPhotoType(bytes);
      if (!type || !isPhotoType(file.type)) return error("Use a JPG, PNG or WebP photo.");
      const pathname = mediaPathFor(file.name, type);
      await writeFile(pathname, Buffer.from(bytes), type);
      return NextResponse.json({ pathname });
    }

    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        await requireUserFor("any");
        if (!MEDIA_PATH.test(pathname)) throw new AuthError("That file name isn't allowed.");
        return {
          allowedContentTypes: Object.keys(PHOTO_TYPES),
          maximumSizeInBytes: MAX_PHOTO_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, 401);
    console.error("Upload failed", err);
    return error("The upload didn't work. Try again.", 500);
  }
}
