import { ref, StorageReference } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "./firebase";

export type StorageAction =
  | "userProfilePics"
  | "botProfilePics"
  | "postsImages"
  | "originalImages"
  | "storePics"
  | "productPics"
  | "communityPics"
  | "staticImages"
  | "adamaProfPic"
  | "articlesPics"
  | "channelsPics"
  | "workspaceImages"
  | "chatImages"
  | "templateMedia"
  | "userMedia"
  | "automationBrandImages";

export default function getStorageRef(action: StorageAction): StorageReference | null {
  switch (action) {
    case "userProfilePics":
      return ref(storage, "user_profile_pictures/" + v4());
    case "botProfilePics":
      return ref(storage, "bot_profile_pictures/" + v4());
    case "chatImages":
      return ref(storage, "chat_images/" + v4());
    case "postsImages":
      return ref(storage, "posts/" + v4());
    case "originalImages":
      return ref(storage, "originalImages/" + v4());
    case "storePics":
      return ref(storage, "storePics/" + v4());
    case "productPics":
      return ref(storage, "productPics/" + v4());
    case "communityPics":
      return ref(storage, "communityPics/" + v4());
    case "staticImages":
      return ref(storage, "staticImages/" + v4());
    case "adamaProfPic":
      return ref(storage, "adamaProfPic/" + v4());
    case "articlesPics":
      return ref(storage, "articlesPics/" + v4());
    case "channelsPics":
      return ref(storage, "channelsPics/" + v4());
    case "workspaceImages":
      return ref(storage, "workspace_images/" + v4());
    case "templateMedia":
      return ref(storage, "template_media/" + v4());
    case "userMedia":
      return ref(storage, "user_media/" + v4());
    case "automationBrandImages":
      return ref(storage, "automation_brand_images/" + v4());
    default:
      return null;
  }
}
