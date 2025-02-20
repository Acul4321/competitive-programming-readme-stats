import { assertEquals } from "@std/assert";
import { validateCardType, validatePlatform } from "../../api/main.ts";

import { Atcoder } from "../../src/platforms/atcoder.ts";

import { Card } from "../../src/cards/card.ts";
import { StatsCard } from "../../src/cards/stats.ts";
import { getTheme } from "../../themes/themes.ts";

const params = {
  show_icons: true,
  hide_border: false,
  use_rank_colour: true,
  theme: getTheme("default")
}
const platform = new Atcoder("acul4321");

Deno.test(async function testCardStats() {
  const card : string = "stats";

  
  const result : Card = await validateCardType(card,platform,params);

  assertEquals(result instanceof StatsCard, true);
});