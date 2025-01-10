import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { themes } from "../themes/themes.ts";

import { Atcoder } from "../src/service/atcoder.ts";  
import { Service } from "../src/service/service.ts";
import { Card } from "../src/cards/card.ts";
import { Stats } from "../src/cards/stats.ts";

const PORT:string = Deno.env.get("SERVER_PORT") ?? "8000";
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = 'Welcome to The Competitive Programming Readme Stats \nThe Supported Platforms Include: \natcoder \n \nThe Types of Cards are:\nstats \n \nThe Command Structure is:\n/{platform}/{type}/{username}?{optionalPeram}'
})

router.get("/:platform/:type/:username", (ctx) => {
  ctx.response.type = "image/svg+xml";  // Set content type for SVG

  let service: Service;
  let type : Card;
  
  //validate platform
  switch(ctx.params.platform) {
    case "atcoder": {
      service = new Atcoder();
      break;
    }
    default: {
      ctx.response.body = "please provide a supported platform";
      return;
    }
  }
  //validate username

  // parse optional perameters
  const queryParam = new Map<string, string>();
  ctx.request.url.searchParams.forEach((v, k) => {
    queryParam.set(k, v);
  });
  ctx.response.body = Object.fromEntries(queryParam);
  
  //optional perameters setting
  const theme = queryParam.get('theme');
  const selectedTheme = theme in themes ? themes[theme] : themes["default"];
  const width = queryParam.get('width') ?? 100;
  const height = queryParam.get('height') ?? 100;
  const border_radius = queryParam.get('border_radius') ?? 4.5;

  //validate type
  switch(ctx.params.type) {
    case "stats": {
      type = new Stats("Acul4321", 42400, 181, 181, 0,selectedTheme);
      break;
    }
    default: {
      ctx.response.body = "please provide a correct card type";
      return;
    }
  }

  
  //ctx.response.body = { ...Object.fromEntries(queryParam), theme: selectedTheme};
  ctx.response.body = type.render();
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: parseInt(PORT) });