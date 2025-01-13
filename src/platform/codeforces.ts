import { Platform,Profile,Competition } from "./platform.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

export class Codeforces extends Platform {
    protected override platform_rating_bands: Map<number, Record<string, string>> = new Map([
        [0, { name: "Newbie", color: "#CCCCCC" }],
        [1200, { name: "Pupil", color: "#B2FA81" }],
        [1400, { name: "Specialist", color: "#A2DABC" }],
        [1600, { name: "Expert", color: "#ACACFB" }],
        [1900, { name: "Candidate Master", color: "#E292FB" }],
        [2100, { name: "Master", color: "#EECD8F" }],
        [2300, { name: "International Master", color: "#EABD62" }],
        [2400, { name: "Grandmaster", color: "#DD7F7B" }],
        [2600, { name: "International Grandmaster", color: "#D6493E" }],
        [3000, { name: "Legendary Grandmaster", color: "#8D1F12" }]
    ]);
    constructor() {
        super("https://codeforces.com/profile/");
    }

    async fetchProfile(username: string): Promise<Profile> {
        //get source
        const source = await this.getSourceHTML(username);
        let doc = new DOMParser().parseFromString(source, 'text/html');

        // populate profile
        const rating = doc.querySelectorAll("ul")[3].querySelectorAll("li")[0].querySelectorAll("span")[0].textContent.trim();
        const highest_rating = doc.querySelectorAll("ul")[3].querySelectorAll("li")[0].querySelectorAll("span")[1].textContent.trim().match(/\d+$/)?.[0] ?? rating;

        const contestSource = (await fetch("https://codeforces.com/contests/with/" + username)).text();
        doc = new DOMParser().parseFromString(await contestSource, 'text/html');
        const rated_matches = doc.querySelectorAll("table")[5].querySelectorAll("tr")[1].querySelectorAll("td")[0].textContent.trim();
        const last_competed = doc.querySelectorAll("table")[5].querySelectorAll("tr")[1].querySelectorAll("td")[2].textContent.trim();

        const rankResponse = await fetch("https://codeforces.com/api/user.ratedList?activeOnly=false&includeRetired=false");
        const rank_json =  await rankResponse.json();
        let rank;
        for( let i = 0; i < rank_json.result.length; i++) {
            if(rank_json.result[i].handle == username) {
                rank = i+1;
                break;
            }
        }
        
        return new Profile(
            username,
            rank,
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