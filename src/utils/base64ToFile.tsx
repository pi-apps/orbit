export function isBase64(str: string): boolean {
  if (typeof str !== "string") return false;

  // Handles both pure base64 and Data URLs
  const dataUrlPattern = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?;base64,/;
  const base64Pattern = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=)?$/i;

  if (dataUrlPattern.test(str)) return true;

  try {
    // Remove whitespace and check if valid base64
    const cleaned = str.replace(/\s+/g, "");
    return base64Pattern.test(cleaned);
  } catch {
    return false;
  }
}
function detectMimeTypeFromBase64(base64: string): string {
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBOR")) return "image/png";
  if (base64.startsWith("R0lGOD")) return "image/gif";
  if (base64.startsWith("UklGR")) return "image/webp";
  return "application/octet-stream";
}

export function base64ToFile(base64String: string, fallbackName = "image.jpg"): File | null {
  try {
    let mimeType = "application/octet-stream";
    let base64Data = base64String;

    if (base64String.startsWith("data:")) {
      const matches = base64String.match(/^data:([a-zA-Z0-9-+/]+);base64,(.*)$/);
      if (!matches || matches.length !== 3) return null;

      mimeType = matches[1];
      base64Data = matches[2];
    } else {
      mimeType = detectMimeTypeFromBase64(base64Data);
    }

    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const extension = mimeType.split("/")[1] || "jpg";
    const finalName = fallbackName.includes(".") ? fallbackName : `file.${extension}`;

    return new File([blob], finalName, { type: mimeType });
  } catch (err) {
    console.error("Failed to convert base64 to file:", err);
    return null;
  }
}