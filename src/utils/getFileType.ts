import { FILETYPE } from "./enums/FileType";

export function getFileType(fileType: string, fileName: string): FILETYPE {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const videoExtensions = ["mp4", "mov", "avi", "webm"];
  if (
    fileType.startsWith("image/") ||
    imageExtensions.includes(fileName.split(".").pop()?.toLowerCase() ?? "")
  ) {
    return FILETYPE.IMAGE;
  } else if (
    fileType.startsWith("video/") ||
    videoExtensions.includes(fileName.split(".").pop()?.toLowerCase() ?? "")
  ) {
    return FILETYPE.VIDEO;
  } else {
    return FILETYPE.UNKNOWN;
  }
}
