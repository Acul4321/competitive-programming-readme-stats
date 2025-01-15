import { assertEquals } from "@std/assert/equals";

Deno.test("deno working test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});
