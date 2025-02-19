import { assert, assertEquals } from "@std/assert";
import { validatePlatform } from "../../api/main.ts";

import { Platform } from "../../src/platforms/platform.ts";
import { Atcoder } from "../../src/platforms/atcoder.ts";
import { Codeforces } from "../../src/platforms/codeforces.ts";

const username : string = "acul4321";

// tests that the atcoder platform is validated
Deno.test(async function testPlatformAtcoder() {
  const platform : string = "atcoder";

  
  const result : Platform = await validatePlatform(platform, username);

  assertEquals(result instanceof Atcoder, true);
});

// tests that the codeforces platform is validated
Deno.test(async function testPlatformCodeforces() {
  const platform : string = "codeforces";

  const result : Platform = await validatePlatform(platform, username);

  assertEquals(result instanceof Codeforces, true);
});