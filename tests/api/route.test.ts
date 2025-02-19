import { assertNotEquals,assert, assertEquals } from "@std/assert";
import { testing } from "@oak/oak";
import { router } from "../../api/main.ts";

//tests the base route of the application router
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

// tests the main route of the application router
Deno.test(async function testMainRoute() {
  const ctx = testing.createMockContext({
    path: "atcoder/rating/acul4321",
    method: "GET"
  });
  const next = testing.createMockNext();

  await router.routes()(ctx, next);

  assertEquals(ctx.params.platform,"atcoder");
  assertEquals(ctx.params.type,"rating");
  assertEquals(ctx.params.username,"acul4321");
});