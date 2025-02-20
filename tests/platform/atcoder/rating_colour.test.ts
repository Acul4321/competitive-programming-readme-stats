import { assertEquals } from "@std/assert";
import { Atcoder } from "../../../src/platforms/atcoder.ts";

Deno.test("Atcoder Rating Colors", async (t) => {
    const platform = new Atcoder("dummy_user");

    await t.step("Gray rating (0-399)", () => {
        assertEquals(platform.getRankColour(200), "#808080");
    });

    await t.step("Brown rating (400-799)", () => {
        assertEquals(platform.getRankColour(600), "#804000");
    });

    await t.step("Green rating (800-1199)", () => {
        assertEquals(platform.getRankColour(1000), "#008000");
    });

    await t.step("Cyan rating (1200-1599)", () => {
        assertEquals(platform.getRankColour(1400), "#00C0C0");
    });

    await t.step("Blue rating (1600-1999)", () => {
        assertEquals(platform.getRankColour(1800), "#0000FF");
    });

    await t.step("Yellow rating (2000-2399)", () => {
        assertEquals(platform.getRankColour(2200), "#C0C000");
    });

    await t.step("Orange rating (2400-2799)", () => {
        assertEquals(platform.getRankColour(2600), "#FF8000");
    });

    await t.step("Red rating (≥ 2800)", () => {
        assertEquals(platform.getRankColour(3000), "#FF0000");
    });
});