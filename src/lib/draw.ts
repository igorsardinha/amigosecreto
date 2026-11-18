import { randomInt } from "node:crypto";

/**
 * Sorteia o amigo secreto.
 *
 * Embaralha os participantes (Fisher–Yates com RNG criptográfico) e forma um
 * único ciclo: cada pessoa tira a próxima da lista, e a última tira a primeira.
 * Assim ninguém tira a si mesmo e não se formam "panelinhas" fechadas.
 *
 * @returns mapa `quemTira -> quemFoiTirado`
 */
export function drawSecretFriends<T>(ids: readonly T[]): Map<T, T> {
  if (ids.length < 3) {
    throw new Error("São necessários pelo menos 3 participantes.");
  }
  if (new Set(ids).size !== ids.length) {
    throw new Error("Participantes duplicados.");
  }

  const shuffled = [...ids];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const result = new Map<T, T>();
  shuffled.forEach((giver, i) => {
    result.set(giver, shuffled[(i + 1) % shuffled.length]);
  });
  return result;
}
