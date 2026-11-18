import { test } from "node:test";
import assert from "node:assert/strict";
import { drawSecretFriends } from "../src/lib/draw";

test("ninguém tira a si mesmo e todos são tirados exatamente uma vez", () => {
  for (let n = 3; n <= 30; n++) {
    const ids = Array.from({ length: n }, (_, i) => `p${i}`);
    for (let run = 0; run < 200; run++) {
      const pairs = drawSecretFriends(ids);
      assert.equal(pairs.size, n);
      for (const [giver, receiver] of pairs) assert.notEqual(giver, receiver);
      assert.equal(new Set(pairs.values()).size, n);
    }
  }
});

test("forma um único ciclo (sem panelinhas)", () => {
  const ids = Array.from({ length: 10 }, (_, i) => i);
  const pairs = drawSecretFriends(ids);
  let cur = ids[0];
  const seen = new Set<number>();
  do {
    seen.add(cur);
    cur = pairs.get(cur)!;
  } while (cur !== ids[0]);
  assert.equal(seen.size, ids.length);
});

test("rejeita menos de 3 participantes e duplicados", () => {
  assert.throws(() => drawSecretFriends(["a", "b"]));
  assert.throws(() => drawSecretFriends(["a", "b", "a"]));
});
