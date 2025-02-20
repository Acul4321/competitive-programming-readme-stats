import { assertEquals } from "@std/assert";
import { Codeforces } from "../../../src/platforms/codeforces.ts";

Deno.test("Codeforces Rating Colors", async (t) => {
    const platform = new Codeforces("dummy_user");

    await t.step("Newbie rating (< 1200)", () => {
        assertEquals(platform.getRankColour(800), "#CCCCCC");
    });

    await t.step("Pupil rating (1200-1399)", () => {
        assertEquals(platform.getRankColour(1300), "#B2FA81");
    });

    await t.step("Specialist rating (1400-1599)", () => {
        assertEquals(platform.getRankColour(1500), "#A2DABC");
    });

    await t.step("Expert rating (1600-1899)", () => {
        assertEquals(platform.getRankColour(1700), "#ACACFB");
    });

    await t.step("Candidate Master rating (1900-2099)", () => {
        assertEquals(platform.getRankColour(2000), "#E292FB");
    });

    await t.step("Master rating (2100-2299)", () => {
        assertEquals(platform.getRankColour(2200), "#EECD8F");
    });

    await t.step("International Master rating (2300-2399)", () => {
        assertEquals(platform.getRankColour(2350), "#EABD62");
    });

    await t.step("Grandmaster rating (2400-2599)", () => {
        assertEquals(platform.getRankColour(2500), "#DD7F7B");
    });

    await t.step("International Grandmaster rating (2600-2999)", () => {
        assertEquals(platform.getRankColour(2800), "#D6493E");
    });

    await t.step("Legendary Grandmaster rating (≥ 3000)", () => {
        assertEquals(platform.getRankColour(3200), "#8D1F12");
    });
});
