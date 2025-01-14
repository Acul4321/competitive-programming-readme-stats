import { assertEquals } from "jsr:@std/assert";

Deno.test("deno working test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});
