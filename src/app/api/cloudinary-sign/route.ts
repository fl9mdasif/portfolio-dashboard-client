import crypto from "crypto";
import { NextResponse } from "next/server";

/** Cloudinary's dashboard hands out `cloudinary://<key>:<secret>@<cloud>`. */
function fromCloudinaryUrl() {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) return {};
  const m = raw.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) return {};
  return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
}

/**
 * Tells the browser how to upload to Cloudinary.
 *
 * - Unsigned mode: an upload preset is configured, so no secret is involved.
 * - Signed mode: we hand back a short-lived signature; the API secret never
 *   leaves the server.
 */
export async function POST() {
  const fallback = fromCloudinaryUrl();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || fallback.cloudName;
  const apiKey = process.env.CLOUDINARY_API_KEY || fallback.apiKey;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || fallback.apiSecret;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "portfolio";
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    return NextResponse.json(
      { message: "Missing Cloudinary env var: CLOUDINARY_CLOUD_NAME" },
      { status: 500 },
    );
  }

  // Unsigned preset wins when present: nothing secret is needed.
  if (preset) {
    return NextResponse.json({ mode: "unsigned", cloudName, folder, preset });
  }

  if (!apiKey || !apiSecret) {
    const missing = [
      !apiKey && "CLOUDINARY_API_KEY",
      !apiSecret && "CLOUDINARY_API_SECRET",
    ].filter(Boolean);
    return NextResponse.json(
      {
        message: `Missing Cloudinary env var(s): ${missing.join(
          ", ",
        )} — or set CLOUDINARY_UPLOAD_PRESET to upload unsigned.`,
      },
      { status: 500 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);

  // Params must be signed in alphabetical order, joined as a query string.
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return NextResponse.json({
    mode: "signed",
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
