import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { themes,Theme } from "../themes/themes.ts";

import { Atcoder } from "../src/platform/atcoder.ts";  
import { Platform } from "../src/platform/platform.ts";
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

//
// routes
//

router.get("/", (ctx) => {
  ctx.response.body = 'Welcome to The Competitive Programming Readme Stats \nThe Supported Platforms Include: \natcoder \n \nThe Types of Cards are:\nstats \n \nThe Command Structure is:\n/{platform}/{type}/{username}?{optionalPeram}'
})

router.get("/:platform/:type/:username", async (ctx) => {
  ctx.response.type = "image/svg+xml";  // Set content type for SVG
  
  // parse optional perameters
  const queryParam = new Map<string, string>();
  ctx.request.url.searchParams.forEach((v, k) => {
    queryParam.set(k, v);
  });
  
  //optional perameters setting
  const them = queryParam.get('theme') as keyof typeof themes ?? "default";
  let hide_border = queryParam.get('border_radius') === 'true';
  if (them in themes){
    theme = { ...themes[them], border_color: "e4e2e2" }
    if ('border_color' in themes[them]) {
      theme.border_color = (themes[them] as Theme).border_color;
    }
    if(hide_border == undefined){
      hide_border = true;
    }
  } else {
    theme = { ...themes["default"], border_color: themes["default"].border_color ?? "e4e2e2" };
  }
  const width: number = parseInt(queryParam.get('width') ?? 'undifined');
  const height: number = parseInt(queryParam.get('height') ?? 'undifined');
  const border_radius: number = parseFloat(queryParam.get('border_radius') ?? 'undefined');

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
    default: {
      throw new Error("Platform not supported");
    }
  }
}

function validateType(type: string): Card {
  switch(type) {
    case "stats": {
      return new Stats(
        platform.profile.getId(), 
        platform.profile.getRank(), 
        platform.profile.getRating(), 
        platform.profile.getHighestRating(), 
        platform.profile.getRatedMatches(),
        platform.profile.getLastCompeted(),
        theme, 
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
