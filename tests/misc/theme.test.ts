import { assertEquals } from "@std/assert";
import { getTheme,Theme } from "../../themes/themes.ts";

// tests that the theme is properly being retrived
Deno.test(function testGetThemeInThemes() {
    const themeName : string = "dracula";

    let theme : Theme = getTheme(themeName);

    assertEquals(theme, new Theme("ff6e96", "79dafa", "f8f8f2", "282a36"));
});

// tests that the theme will defualt to default
Deno.test(function testGetThemeNotInThemes() {
    const themeName : string = "undifinedNull100%notReal"; // hopefully no theme will be names this
    
    let theme : Theme = getTheme(themeName);
    
    assertEquals(theme, new Theme("2f80ed", "4c71f2", "434d58", "fffefe", "e4e2e2"));
});

// tests that the theme will stay default
Deno.test(function testGetThemeDefault() {
    const themeName : string = "default";
    
    let theme : Theme = getTheme(themeName);
    
    assertEquals(theme, new Theme("2f80ed", "4c71f2", "434d58", "fffefe", "e4e2e2"));
});