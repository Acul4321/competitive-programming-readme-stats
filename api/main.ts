import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import "jsr:@std/dotenv/load";

import { getTheme } from "../themes/themes.ts";

/*
// Variables
*/
const PORT:string = Deno.env.get("PORT") ?? "8000";

// Card type and platform
// let platform: Platform;
// let type: Card;

/*
// Routes
*/
const router = new Router();

router.get("/:platform/:type/:username", async (ctx) => {
  try {
    // ctx.response.type = "image/svg+xml";  // Set content type for SVG

    const perams = optionalQueryParams(ctx.request.url); // query perameter setup
    throw new Error("");
    
    ctx.response.body = "W";

  } catch (e) {
    console.error("Unhandled error:", e);
    ctx.response.status = 500;
    ctx.response.headers.set("error", "main");
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

export function optionalQueryParams(url: URL) {
  // parse optional perameters
  const queryParam = new Map<string, string>();
  url.searchParams.forEach((v, k) => {
    queryParam.set(k, v);
  });
  
  return {
  // set card config perameters
  show_icons : queryParam.get('show_icons') === 'false' ? false : true,
  hide_border : queryParam.get('hide_border') === 'true' ? true : false,
  use_rank_colour : queryParam.get('use_rank_colour') === 'true' ? true : false,
  theme : getTheme(queryParam.get('theme')),

  // set optional perameters
  width : queryParam.get('width') !== undefined ? parseInt(queryParam.get('width')!) : undefined,
  height : queryParam.get('height') !== undefined ? parseInt(queryParam.get('height')!) : undefined,
  border_radius : queryParam.get('border_radius') !== undefined ? parseInt(queryParam.get('border_radius')!) : undefined
  };
}