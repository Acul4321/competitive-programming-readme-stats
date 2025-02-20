import { assertEquals } from "@std/assert/equals";
import { formatDate } from "../../src/utils.ts";

Deno.test(async function testFormatDateProperly() {
    const unix_time = 1592416255 * 1000; //epoch conversion to unix

    const date : string = formatDate(new Date(unix_time))

    assertEquals(date,"2020/06/17")
});