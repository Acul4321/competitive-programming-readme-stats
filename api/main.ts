import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { themes,Theme } from "../themes/themes.ts";

import { Platform } from "../src/platform/platform.ts";
import { Atcoder } from "../src/platform/atcoder.ts";  
import { Codeforces } from "../src/platform/codeforces.ts";

import { Card } from "../src/cards/card.ts";
import { Stats } from "../src/cards/stats.ts";

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

//
// routes
//

router.get("/", (ctx) => {
  ctx.response.body = 'Welcome to The Competitive Programming Readme Stats \nThe Supported Platforms Include: \natcoder \n \nThe Types of Cards are:\nstats \n \nThe Command Structure is:\n/{platform}/{type}/{username}?{optionalPeram}'
})

router.get("/:platform/:type/:username", async (ctx) => {
  ctx.response.type = "image/svg+xml";  // Set content type for SVG
  
  //query perameter setup
  optionalQueryParams(ctx.request.url);

  //validate platform
  platform = validatePlatform(ctx.params.platform);

  //validate username
  platform.profile = await platform.fetchProfile(ctx.params.username)
  
  //validate type
  type = validateType(ctx.params.type);
  
  //render the card
  ctx.response.body = type.render();
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: parseInt(PORT) });

//
//functions
//

function validatePlatform(platform: string): Platform{
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
  use_rank_colour = queryParam.get('use_rank_colour') === 'true' ? true : false;
}
