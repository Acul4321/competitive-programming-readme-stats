import { Application, Context, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import "jsr:@std/dotenv/load";

import { getTheme } from "../themes/themes.ts";

import { Card } from "../src/cards/card.ts";
import { ErrorCard } from "../src/cards/error.ts";

import { Platform } from "../src/platforms/platform.ts";
import { Atcoder } from "../src/platforms/atcoder.ts";
import { Codeforces } from "../src/platforms/codeforces.ts";


/*
// Variables
*/

const PORT:string = Deno.env.get("PORT") ?? "8000";

/*
// Routes
*/

const router = new Router();

router.get("/:platform/:type/:username", async (ctx) => {
  ctx.response.type = "image/svg+xml";  // Set content type for SVG

  try {
    const params = optionalQueryParams(ctx.request.url); // query perameter setup
    
    const platform : Platform = await validatePlatform(ctx.params.platform, ctx.params.username); // init platform

    const card = validateCardType(ctx.params.type); // init card type

    ctx.response.body = card.render(); // render card

  } catch (e) {
    console.error("Unhandled error:", e);
    ctx.response.status = 500;
    ctx.response.headers.set("error", "main");
    ctx.response.body = new ErrorCard(true, true, true, getTheme("default"), e as Error, "Main Route Error", { width: 400, height: 200 }).render();
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

export async function validatePlatform(platform: string, username: string): Promise<Platform> {
    let platformInstance: Platform;
    switch(platform) {
        case "atcoder": {
            platformInstance = new Atcoder(username);
            break;
        }
        case "codeforces": {
            platformInstance = new Codeforces(username);
            break;
        }
        default: {
            throw new Error("Platform not supported");
        }
    }
    await platformInstance.initialize(username);
    return platformInstance;
}

export function validateCardType(type: string): Card {
  switch(type) {
    case "stats": {
      throw new Error("Stat Card Type not yet Implemented");
      // return new Stats(
      //   platform,
      //   use_rank_colour,
      //   theme, 
      //   show_icons,
      //   hide_border, 
      //   width, 
      //   height, 
      //   border_radius);
    }
    case "heatmap": {
      throw new Error("Heatmap Card Type not yet Implemented");
    //   return new Heatmap(
    //     platform,
    //     data_type,
    //     theme,
    //     show_icons,
    //     hide_border,
    //     width,
    //     height,
    //     border_radius);
    }
    case "graph": {
      throw new Error("Graph Card Type not yet Implemented");
    }
    default: {
      throw new Error("Card type not supported");
    }
  }
}