import { randomBytes, randomInt } from "node:crypto";

/** Token secreto, não adivinhável (usado em links pessoais e do anfitrião). */
export function secretToken(bytes = 18): string {
  return randomBytes(bytes).toString("base64url");
}

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // sem caracteres ambíguos

/** Código curto e legível para o link de convite. */
export function inviteCode(length = 8): string {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}
