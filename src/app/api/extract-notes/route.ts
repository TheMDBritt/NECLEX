import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Expected a file upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file attached." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 25 MB)." },
      { status: 413 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const name = file.name.toLowerCase();
  const type = file.type;

  try {
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const result = await extractText(pdf, { mergePages: true });
      const text = Array.isArray(result.text) ? result.text.join("\n") : result.text;
      return NextResponse.json({
        text: cleanWhitespace(text),
        pageCount: result.totalPages,
      });
    }

    if (
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: cleanWhitespace(result.value) });
    }

    if (
      type.startsWith("text/") ||
      name.endsWith(".txt") ||
      name.endsWith(".md") ||
      name.endsWith(".markdown")
    ) {
      return NextResponse.json({ text: cleanWhitespace(buffer.toString("utf-8")) });
    }

    return NextResponse.json(
      {
        error: `Unsupported file type${type ? ` (${type})` : ""}. Try PDF, DOCX, TXT, or MD.`,
      },
      { status: 415 },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Couldn't read that file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function cleanWhitespace(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
