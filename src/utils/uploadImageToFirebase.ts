import imageCompression from "browser-image-compression";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { FILETYPE } from "./enums/FileType";
import { getFileType } from "./getFileType";
import getStorageRef, { StorageAction } from "./getStorageRef";
import {
  DEFAULT_BOT_PLACEHOLDER_IMAGE_URL,
  DEFAULT_PROFILE_PIC_URL,
} from "./constants";

export default async function uploadImageToFirebase(
  file: File | null,
  action: StorageAction
): Promise<string> {
  if (file === null) {
    if (action === "userProfilePics") {
      return DEFAULT_PROFILE_PIC_URL;
    } else if (action === "botProfilePics") {
      // You might want a different default for bots, or handle this as an error if a bot pic is mandatory
      return DEFAULT_BOT_PLACEHOLDER_IMAGE_URL;
    }
    // Fallback for other actions if any, or throw error
    return DEFAULT_PROFILE_PIC_URL;
  }
  let url = "";
  const fileSizeInMB = file.size / 1024 / 1024;
  const options = {
    maxSizeMB: fileSizeInMB / 1.5,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  };
  try {
    const compressedFile =
      getFileType(file.type, file.name) === FILETYPE.VIDEO
        ? file
        : fileSizeInMB < 0.1
          ? file
          : await imageCompression(file, options);
    const storageRef = getStorageRef(action);
    await uploadBytes(storageRef!, compressedFile).then(
      async (snapshot: any) => {
        await getDownloadURL(snapshot.ref).then((downloadURL: any) => {
          url = downloadURL;
        });
      }
    );
  } catch (error) {
    throw error;
  }
  return url;
}
