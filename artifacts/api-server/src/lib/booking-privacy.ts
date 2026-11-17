import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const sessionSecret = process.env.SESSION_SECRET;
const bookingEncryptionSecret = process.env.BOOKING_ENCRYPTION_KEY;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required to protect booking contact details");
}
if (!bookingEncryptionSecret) {
  throw new Error("BOOKING_ENCRYPTION_KEY is required to protect booking contact details");
}

// v1 compatibility: existing ciphertexts used SHA-256(SESSION_SECRET).
const legacyEncryptionKey = createHash("sha256").update(sessionSecret).digest();
const bookingEncryptionKey = createHash("sha256")
  .update("sanad-booking-contact:v2:")
  .update(bookingEncryptionSecret)
  .digest();

export interface BookingContact {
  nickname: string;
  contactMethod: "phone" | "whatsapp" | "email";
  contactValue: string;
}

export function encryptBookingContact(contact: BookingContact): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", bookingEncryptionKey, iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(contact), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    "v2",
    iv.toString("base64url"),
    authTag.toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
}

export function decryptBookingContact(encrypted: string): BookingContact {
  const isCurrentVersion = encrypted.startsWith("v2.");
  const payload = isCurrentVersion ? encrypted.slice("v2.".length) : encrypted;
  const [ivPart, authTagPart, ciphertextPart] = payload.split(".");
  if (!ivPart || !authTagPart || !ciphertextPart) {
    throw new Error("Stored booking contact data is malformed");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    isCurrentVersion ? bookingEncryptionKey : legacyEncryptionKey,
    Buffer.from(ivPart, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(authTagPart, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextPart, "base64url")),
    decipher.final(),
  ]).toString("utf8");

  return JSON.parse(plaintext) as BookingContact;
}
