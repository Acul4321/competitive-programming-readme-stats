import { assertEquals } from "@std/assert";
import { Card } from "../../src/cards/Card.ts";
import { Theme,getTheme} from "../../themes/themes.ts";

class TestCard extends Card {
    public override default_width : number = 200;
    public override default_height : number = 100;
    public override default_border_radius: number = 4.5;
}

// tests Card init functionality
Deno.test("testCardInitCustomValues", () => {
    const theme : Theme = getTheme("dark");
    const card = new TestCard({ width: 300, height: 150, border_radius: 10 },true, true, false, theme);

    assertEquals(card.show_icons, true);
    assertEquals(card.hide_border, true);
    assertEquals(card.use_rank_colour, false);
    assertEquals(card.theme, theme);
    assertEquals(card.width, 300);
    assertEquals(card.height, 150);
    assertEquals(card.border_radius, 10);

});

// Test only width is provided, height should scale accordingly
Deno.test("testCardInitWidthScaling", () => {
    const theme : Theme = getTheme("light");
    const card = new TestCard({ width: 400 },false, false, false, theme);

    const expectedHeight = 400 * (100 / 200); // Original aspect ratio: 200:100

    assertEquals(card.width, 400);
    assertEquals(card.height, expectedHeight);
});

// Test only height is provided, width should scale accordingly
Deno.test("testCardInitHeightScaling", () => {
    const theme : Theme = getTheme("dark");
    const card = new TestCard({ height: 200 },false, false, false, theme);

    const expectedWidth = 200 * (200 / 100); // Original aspect ratio: 200:100

    assertEquals(card.width, expectedWidth);
    assertEquals(card.height, 200);
});

// Test border radius assignment
Deno.test("testCardInitBorderRadius", () => {
    const theme : Theme = getTheme("light");
    const card = new TestCard({ border_radius: 15 },false,false,false,theme);

    assertEquals(card.border_radius, 15);
});