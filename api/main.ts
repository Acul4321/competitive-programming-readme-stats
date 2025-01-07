import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";

const PORT:string = Deno.env.get("SERVER_PORT") ?? "8000";
const app = new Application();
const router = new Router();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Listening on http://localhost:" + PORT + '/')
}

router.get("/", (ctx) => {
  ctx.response.body = 'Hello World'
})

await app.listen({ port: parseInt(PORT) });