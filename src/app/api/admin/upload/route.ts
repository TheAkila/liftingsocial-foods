import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getSession } from "@/lib/auth";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP, or AVIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max ${(MAX_BYTES / 1024 / 1024).toFixed(0)} MB.` },
      { status: 400 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extFromType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  const ext = extFromType[file.type] ?? "bin";
  const id = crypto.randomBytes(12).toString("hex");
  const filename = `${id}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  const url = `/uploads/${filename}`;
  return NextResponse.json({ url });
}
