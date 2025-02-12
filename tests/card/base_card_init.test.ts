import { assertEquals } from "@std/assert";
import { Card } from "../../src/cards/card.ts";
import { Theme,getTheme} from "../../themes/themes.ts";

class TestCard extends Card {
    public override readonly default_width: number = 200;
    public override readonly default_height: number = 100;
    public override readonly default_border_radius: number = 10;

    protected renderTitle(): string {
        return "Test Card";
    }
    protected renderBody(): string {
        return "Test Card Body";
    }
}

// tests Card init functionality
Deno.test("testCardInitCustomValues", () => {
    const theme : Theme = getTheme("dark");
    const card = new TestCard(true, true, false, theme,{ width : 250, height : 125, border_radius : 5 });
    card.render();

    assertEquals(card.show_icons, true);
    assertEquals(card.hide_border, true);
    assertEquals(card.use_rank_colour, false);
    assertEquals(card.theme, theme);
    assertEquals(card.width, 250);
    assertEquals(card.height, 125);
    assertEquals(card.border_radius, 5);
    
});

// Test no optional parameters provided
Deno.test("testCardInitNoPerameters", () => {
    const theme : Theme = getTheme("light");
    const card = new TestCard(true,true,false,theme);
    card.render();


    assertEquals(card.show_icons, true);
    assertEquals(card.hide_border, true);
    assertEquals(card.use_rank_colour, false);
    assertEquals(card.theme, theme);
    assertEquals(card.width, 200);
    assertEquals(card.height, 100);
    assertEquals(card.border_radius, 10);
});

// Test only width is provided, height should scale accordingly
Deno.test("testCardInitWidthScaling", () => {
    const theme : Theme = getTheme("light");
    const card = new TestCard(false, false, false, theme, { width: 400 });
    card.render();

    const expectedHeight = 400 * (100 / 200); // Original aspect ratio: 200:100

    assertEquals(card.width, 400);
    assertEquals(card.height, expectedHeight);
});

// Test only height is provided, width should scale accordingly
Deno.test("testCardInitHeightScaling", () => {
    const theme : Theme = getTheme("dark");
    const card = new TestCard(false, false, false, theme, { height: 200});
    card.render();

    const expectedWidth = 200 * (200 / 100); // Original aspect ratio: 200:100

    assertEquals(card.width, expectedWidth);
    assertEquals(card.height, 200);
});

// Test border radius assignment
Deno.test("testCardInitBorderRadius", () => {
    const theme : Theme = getTheme("light");
    const card = new TestCard(false,false,false,theme,{border_radius: 15});
    card.render();

    assertEquals(card.border_radius, 15);
});