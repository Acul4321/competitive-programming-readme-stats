import { assertNotEquals,assert } from "@std/assert";
import { testing } from "@oak/oak";
import { router } from "../../api/main.ts";

Deno.test(async function testAppListening() {
    const ctx = testing.createMockContext({
      path: "/",
      method: "GET"
    });
    const next = testing.createMockNext();

    await router.routes()(ctx, next);

    assert(typeof ctx.response.body === "string"); //response body is type string
    assertNotEquals(ctx.response.status, 500); //response status is not an error
});