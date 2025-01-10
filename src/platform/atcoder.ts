import { Platform, Profile, Competition } from "./platform.ts";
import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

export class Atcoder extends Platform {
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
        return [new Competition(new Date(), true, "contest_jp")];
    }

    //Profile Setters

}
