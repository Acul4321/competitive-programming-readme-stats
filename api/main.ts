import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { themes,Theme } from "../themes/themes.ts";

import { Platform } from "../src/platform/platform.ts";
import { Atcoder } from "../src/platform/atcoder.ts";  
import { Codeforces } from "../src/platform/codeforces.ts";

import { Card } from "../src/cards/card.ts";
import { Stats } from "../src/cards/stats.ts";
import { Heatmap } from "../src/cards/heatmap.ts";

const PORT:string = Deno.env.get("SERVER_PORT") ?? "8000";
const router = new Router();

//variables
let platform: Platform;
let type: Card;
//query perameter variables
let width: number;
let height: number;
let theme: Theme;
let show_icons: boolean;
let hide_border: boolean;
let border_radius: number;

//stats Card
let use_rank_colour: boolean;

//heatmap Card
let data_type: string;

//
// routes
//
router.get("/:platform/:type/:username", async (ctx) => {
  try {
    ctx.response.type = "image/svg+xml";  // Set content type for SVG
  
    //query perameter setup
    optionalQueryParams(ctx.request.url);

    //validate platform
    platform = validatePlatform(ctx.params.platform);

    // init profile
    platform.profile = await platform.fetchProfile(ctx.params.username)
    
    //validate type
    type = validateType(ctx.params.type);
    
    //render the card
    ctx.response.body = type.render();

  } catch (e) {
    console.error("Unhandled error:", e);
    ctx.response.status = 500;
    ctx.response.body = "Internal Server Error";
  }
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: parseInt(PORT) });

//
//functions
//

export function validatePlatform(platform: string): Platform{
    switch(platform) {
    case "atcoder": {
      return new Atcoder();
    }
    case "codeforces": {
      return new Codeforces();
    }
    default: {
      throw new Error("Platform not supported");
    }
  }
}

function validateType(type: string): Card {
  switch(type) {
    case "stats": {
      return new Stats(
        platform,
        use_rank_colour,
        theme, 
        show_icons,
        hide_border, 
        width, 
        height, 
        border_radius);
    }
    case "heatmap": {
      return new Heatmap(
        platform,
        data_type,
        theme,
        show_icons,
        hide_border,
        width,
        height,
        border_radius);
    }
    default: {
      throw new Error("Card type not supported");
    }
  }
}

function optionalQueryParams(url: URL): void {
  // parse optional perameters
  const queryParam = new Map<string, string>();
  url.searchParams.forEach((v, k) => {
    queryParam.set(k, v);
  });
  
  //set optional perameters
  const th = queryParam.get('theme') as keyof typeof themes ?? "default";
  if (th in themes){
    theme = { ...themes[th], border_color: (themes[th] as Theme).border_color ?? "e4e2e2" };
  } else {
    theme = themes["default"];
  }

  width = parseInt(queryParam.get('width') ?? '-1');
  height = parseInt(queryParam.get('height') ?? '-1');
  border_radius = parseFloat(queryParam.get('border_radius') ?? '-1');
  show_icons = queryParam.get('show_icons') === 'false' ? false : true;
  hide_border = queryParam.get('hide_border') === 'true' ? true : false;

  //stats card
  use_rank_colour = queryParam.get('use_rank_colour') === 'true' ? true : false;

  //heatmap
  data_type = queryParam.get('data_type') === 'contest' ? 'contest' : 'submission';
}
