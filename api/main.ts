import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { themes } from "../themes/themes.ts";

const PORT:string = Deno.env.get("SERVER_PORT") ?? "8000";
const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = 'Welcome to The Competitive Programming Readme Stats \nThe Supported Platforms Include: \natcoder \n \nThe Types of Cards are:\nstats \n \nThe Command Structure is:\n/{platform}/{type}/{username}?{optionalPeram}'
})

router.get("/:platform/:type/:username", (ctx) => {
  //validate platform
  switch(ctx.params.platform) {
    case "atcoder": {
      ctx.response.body = "atcoder";
      break;
    }
    default: {
      ctx.response.body = "please provide a supported platform";
      return;
    }
  }
  //validate type
  switch(ctx.params.type) {
    case "stats": {
      ctx.response.body = "stats";
      break;
    }
    default: {
      ctx.response.body = "please provide a correct card type";
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
  // const width = queryParam.get('width') ?? 100;
  // const height = queryParam.get('height') ?? 100;
  
  ctx.response.body = { ...Object.fromEntries(queryParam), theme: selectedTheme};
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: parseInt(PORT) });