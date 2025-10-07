import * as admin from "firebase-admin";

import serviceAccount from "../arthereum/serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
}
const db = admin.firestore();
