import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import "jsr:@std/dotenv/load";

/*
// Variables
*/
const PORT:string = Deno.env.get("PORT") ?? "8000";

// Card type and platform
// let platform: Platform;
// let type: Card;

let width: number;
let height: number;
// let theme: Theme;
let show_icons: boolean;
let hide_border: boolean;
let border_radius: number;

/*
// Routes
*/
const router = new Router();

router.get("/:platform/:type/:username", async (ctx) => {
  try {
    ctx.response.body = "Hello World;"

  } catch (e) {
    console.error("Unhandled error:", e);
    ctx.response.status = 500;
    ctx.response.body = "Internal Server Error";
  }
});

router.get('/', (ctx) => {
  ctx.response.body = 'Welcome to the API!';
});

/*
// Application Initialisation
*/
const app = new Application();
app.use(oakCors()); // enable cors
app.use(router.routes());
app.use(router.allowedMethods());

export { app, router };

if (import.meta.main) {
  console.log(`Server running on port ${PORT}`);
  await app.listen({ port: parseInt(PORT) });
}

/*
// Functions
*/