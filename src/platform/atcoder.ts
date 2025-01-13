import { Platform, Profile, Competition } from "./platform.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

export class Atcoder extends Platform {
    protected override platform_rating_bands: Map<number, Record<string, string>> = new Map([
        [0, { name: "Grey", color: "#808080" }],
        [400, { name: "Brown", color: "#804000" }],
        [800, { name: "Green", color: "#008000" }],
        [1200, { name: "Cyan", color: "#00C0C0" }],
        [1600, { name: "Blue", color: "#0000FF" }],
        [2000, { name: "Yellow", color: "#C0C000" }],
        [2400, { name: "Orange", color: "#FF8000" }],
        [2800, { name: "Red", color: "#FF0000" }]
    ]);
    constructor() {
        super("https://atcoder.jp/user/");
    }

    async fetchProfile(username: string): Promise<Profile> {
        //get source
        const source = await this.getSourceHTML(username);
        const doc = new DOMParser().parseFromString(source, 'text/html');

        // populate profile
        const rank = doc.querySelectorAll("table")[1].querySelectorAll("td")[0].textContent.trim();
        const rating = doc.querySelectorAll("table")[1].querySelectorAll("td")[1].textContent.trim();
        const highest_rating = doc.querySelectorAll("table")[1].querySelectorAll("td")[2].textContent.split('\n')[0].trim();
        const rated_matches = doc.querySelectorAll("table")[1].querySelectorAll("td")[3].textContent.trim();
        const last_competed = doc.querySelectorAll("table")[1].querySelectorAll("td")[4].textContent.trim();

        return new Profile(
            username,
            parseInt(rank),
            parseInt(rating),
            parseInt(highest_rating),
            parseInt(rated_matches),
            new Date(last_competed)
        );
    }

    async fetchCompetitionHistory(url: string): Promise<Competition[]> {
        return await [new Competition(new Date(), true, "contest_jp")];
    }
}
