import { assertEquals } from "@std/assert/equals";
import { Platform } from "../../src/platform/platform.ts";
import { validatePlatform } from "../../api/main.ts";
import { Atcoder } from "../../src/platform/atcoder.ts";

// Deno.test("validate platform atocder", () => {
//     const atcoderInputStub: string = "atcoder";

//     const atcoderReturn: Platform = validatePlatform(atcoderInputStub);

//     assertEquals(atcoderReturn instanceof Atcoder, true);

// });

Deno.test({
  name: "validate platform atcoder",
  fn: () => {
    const atcoderInputStub: string = "atcoder";

    const atcoderReturn: Platform = validatePlatform(atcoderInputStub);

    assertEquals(atcoderReturn instanceof Atcoder, true);
  },
  sanitizeOps: false, // To debug dangling operations
  sanitizeResources: false, // To debug resource leaks
});