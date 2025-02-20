import { assertEquals } from "@std/assert";
import { StatsCard } from "../../../src/cards/stats.ts";
import { Atcoder } from "../../../src/platforms/atcoder.ts";
import { Codeforces } from "../../../src/platforms/codeforces.ts";
import { getTheme } from "../../../themes/themes.ts";

const defaultTheme = getTheme("default");

// Codeforces Tests
Deno.test("Codeforces Rating Band Progress", async (t) => {
    const platform = new Codeforces("dummy_user");
    const card = new StatsCard(false, false, true, defaultTheme, platform);

    await t.step("Newbie to Pupil progress (0-1200)", () => {
        assertEquals(card.calcRatingBandProgress(600), 0.5);
    });

    await t.step("Pupil to Specialist progress (1200-1400)", () => {
        assertEquals(card.calcRatingBandProgress(1300), 0.5);
    });

    await t.step("Expert boundary case (1600)", () => {
        assertEquals(card.calcRatingBandProgress(1600), 0);
    });

    await t.step("Above Legendary Grandmaster (>3000)", () => {
        assertEquals(card.calcRatingBandProgress(3200), 1);
    });

    await t.step("Negative rating", () => {
        assertEquals(card.calcRatingBandProgress(-100), 0);
    });
});

// Atcoder Tests
Deno.test("Atcoder Rating Band Progress", async (t) => {
    const platform = new Atcoder("dummy_user");
    const card = new StatsCard(false, false, true, defaultTheme, platform);

    await t.step("Gray to Brown progress (0-400)", () => {
        assertEquals(card.calcRatingBandProgress(200), 0.5);
    });

    await t.step("Green to Cyan progress (800-1200)", () => {
        assertEquals(card.calcRatingBandProgress(1000), 0.5);
    });

    await t.step("Blue boundary case (1600)", () => {
        assertEquals(card.calcRatingBandProgress(1600), 0);
    });

    await t.step("Above Red (>2800)", () => {
        assertEquals(card.calcRatingBandProgress(3000), 1);
    });

    await t.step("Negative rating", () => {
        assertEquals(card.calcRatingBandProgress(-100), 0);
    });
});

// Edge Cases
Deno.test("Rating Band Progress Edge Cases", async (t) => {
    const codeforcesCard = new StatsCard(false, false, true, defaultTheme, new Codeforces("dummy_user"));
    const atcoderCard = new StatsCard(false, false, true, defaultTheme, new Atcoder("dummy_user"));

    await t.step("Zero rating", () => {
        assertEquals(codeforcesCard.calcRatingBandProgress(0), 0);
        assertEquals(atcoderCard.calcRatingBandProgress(0), 0);
    });

    await t.step("Exactly at band boundaries - Codeforces", () => {
        assertEquals(codeforcesCard.calcRatingBandProgress(1200), 0);
        assertEquals(codeforcesCard.calcRatingBandProgress(2400), 0);
    });

    await t.step("Exactly at band boundaries - Atcoder", () => {
        assertEquals(atcoderCard.calcRatingBandProgress(400), 0);
        assertEquals(atcoderCard.calcRatingBandProgress(2400), 0);
    });
});
