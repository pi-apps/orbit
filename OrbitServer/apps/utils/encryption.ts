import * as crypto from "crypto";
import { sha256 } from "js-sha256";

const algorithm = "aes-256-cbc"; // AES encryption algorithm
const key = Buffer.from(
  sha256("YourKeyHere").substring(0, 64),
  "hex"
); // Generate a random 256-bit key
const iv = Buffer.from(
  sha256("YourIVHere").substring(0, 32),
  "hex"
); // Generate a random initialization vector

// Convert the IV string to a buffer

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
