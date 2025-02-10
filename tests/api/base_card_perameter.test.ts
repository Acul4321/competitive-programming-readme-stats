import { assertNotEquals,assert, assertEquals } from "@std/assert";
import { testing } from "@oak/oak";
import { router,optionalQueryParams } from "../../api/main.ts";
import { Theme,getTheme } from "../../themes/themes.ts";

/*
// tests if the api/main.ts optionalQueryParams() parses correctly
*/

// test width parsing
Deno.test(async function testOptionalPeramsWidth() {
  const url : URL = new URL("https:/atcoder/stats/acul4321?width=200");

  const perams = optionalQueryParams(url);

  assertEquals(perams.width,200);
});

// test height parsing
Deno.test("testOptionalParamsHeight", () => {
  const url = new URL("https://example.com/atcoder/stats/acul4321?height=150");

  const params = optionalQueryParams(url);

  assertEquals(params.height, 150);
});

// test border_radius parsing
Deno.test("testOptionalParamsBorderRadius", () => {
  const url = new URL("https://example.com/atcoder/stats/acul4321?border_radius=10");

  const params = optionalQueryParams(url);

  assertEquals(params.border_radius, 10);
});

// test show_icons parsing (default true, false if explicitly set)
Deno.test("testOptionalParamsShowIcons", () => {
  const urlTrue = new URL("https://example.com/atcoder/stats/acul4321");

  const paramsTrue = optionalQueryParams(urlTrue);

  assertEquals(paramsTrue.show_icons, true); // Defaults to true

  const urlFalse = new URL("https://example.com/atcoder/stats/acul4321?show_icons=false");

  const paramsFalse = optionalQueryParams(urlFalse);

  assertEquals(paramsFalse.show_icons, false);
});

// test hide_border parsing (default false, true if explicitly set)
Deno.test("testOptionalParamsHideBorder", () => {
  const urlFalse = new URL("https://example.com/atcoder/stats/acul4321");

  const paramsFalse = optionalQueryParams(urlFalse);

  assertEquals(paramsFalse.hide_border, false); // Defaults to false

  const urlTrue = new URL("https://example.com/atcoder/stats/acul4321?hide_border=true");

  const paramsTrue = optionalQueryParams(urlTrue);

  assertEquals(paramsTrue.hide_border, true);
});

// test use_rank_colour parsing (default false, true if explicitly set)
Deno.test("testOptionalParamsUseRankColour", () => {
  const urlFalse = new URL("https://example.com/atcoder/stats/acul4321");

  const paramsFalse = optionalQueryParams(urlFalse);

  assertEquals(paramsFalse.use_rank_colour, false); // Defaults to false

  const urlTrue = new URL("https://example.com/atcoder/stats/acul4321?use_rank_colour=true");

  const paramsTrue = optionalQueryParams(urlTrue);

  assertEquals(paramsTrue.use_rank_colour, true);
});

// test theme parsing (mocked getTheme function)
Deno.test("testOptionalParamsTheme", () => {
  const url = new URL("https://example.com/atcoder/stats/acul4321?theme=dracula");

  const params = optionalQueryParams(url);
  
  assertEquals(params.theme, getTheme("dracula")); // Assuming getTheme returns the correct theme object
});
