import { Platform, Profile, Competition, Submission, Result, submissionType } from "./platform.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

export class Atcoder extends Platform {
    public override platform_name: string = "Atcoder";
    protected override platform_rating_bands: Map<number, Record<string, string>> = new Map([
        [0, { name: "Grey", colour: "#808080" }],
        [400, { name: "Brown", colour: "#804000" }],
        [800, { name: "Green", colour: "#008000" }],
        [1200, { name: "Cyan", colour: "#00C0C0" }],
        [1600, { name: "Blue", colour: "#0000FF" }],
        [2000, { name: "Yellow", colour: "#C0C000" }],
        [2400, { name: "Orange", colour: "#FF8000" }],
        [2800, { name: "Red", colour: "#FF0000" }]
    ]);
    constructor() {
        super("https://atcoder.jp/user/");
    }

    async fetchProfile(username: string): Promise<Profile> {
        try{
            //get source
            const source = await this.getSourceHTML(username);
            const doc = new DOMParser().parseFromString(source, 'text/html');

            // populate profile
            const rank = doc.querySelectorAll("table")[1].querySelectorAll("td")[0].textContent.trim();
            const rating = doc.querySelectorAll("table")[1].querySelectorAll("td")[1].textContent.trim();
            const highest_rating = doc.querySelectorAll("table")[1].querySelectorAll("td")[2].textContent.split('\n')[0].trim();
            const rated_matches = doc.querySelectorAll("table")[1].querySelectorAll("td")[3].textContent.trim();
            const last_competed = doc.querySelectorAll("table")[1].querySelectorAll("td")[4].textContent.trim();

            const competition_history: Competition[] = await this.fetchCompetitionHistory(username);

            const subbmissions: Submission[] = await this.fetchSubmissions(username);

            return new Profile(
                username,
                parseInt(rank),
                parseInt(rating),
                parseInt(highest_rating),
                parseInt(rated_matches),
                new Date(last_competed),
                competition_history,
                subbmissions
            );
        } catch (e) {
            console.error(`Error fetching profile for ${username}:`, e);
            throw e;
        }
    }

    async fetchCompetitionHistory(username: string): Promise<Competition[]> {
        try{
            const competitionHistory: Competition[] = [];
            
            const contestSource = (await fetch("https://atcoder.jp/users/" + username + "/history")).text();
            const doc = new DOMParser().parseFromString(await contestSource, 'text/html');
            
            let old_rating: number = 0;
            const rows = doc.querySelectorAll("#history tbody tr");
            for(const row of rows) {
                // Extract cells
                const cells = row.querySelectorAll("td");

                const contest_name: string = cells[1].textContent.trim();
                const date: Date = new Date(cells[0].textContent);
                const rank: number = parseInt(cells[2].textContent.trim());
                let is_rated: boolean = true;
                if(cells[3].textContent.trim() == "-") {
                    is_rated = false;
                    competitionHistory.push(new Competition(contest_name, date, is_rated,rank));
                    continue;
                }
                const performance: number = parseInt(cells[3].textContent.trim());
                const new_rating: number = parseInt(cells[4].textContent.trim());

                competitionHistory.push(new Competition(contest_name, date, is_rated, rank, performance, old_rating, new_rating));
                old_rating = new_rating;
            }
            return competitionHistory;
        } catch (e) {
            console.error(`Error fetching competition history for ${username}:`, e);
            throw e;
        }
    }

    override async fetchSubmissions(username: string): Promise<Submission[]> {
        try {
            const submissions: Submission[] = [];
    
            const contentSource = await fetch("https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=" + username + "&from_second=0");
            const submission_json = await contentSource.json();
    
            for (const sub of submission_json) {
                const submission = new Submission(
                    new Date(sub.epoch_second * 1000),
                    submissionType.NA,  //no clue to get state
                    sub.result === "AC" ? Result.AC :
                        sub.result === "TLE" ? Result.TLE :
                        sub.result === "MLE" ? Result.MLE :
                        sub.result === "CE" ? Result.CE :
                        sub.result === "RE" ? Result.RE :
                        sub.result === "OLE" ? Result.OLE :
                        sub.result === "WA" ? Result.WA : Result.IE,
                    sub.language,
                    sub.point,
                    (sub.problem_id.split('_')[1]).toUpperCase()
                );
                submissions.push(submission);
            }
    
            return submissions;
        } catch (e) {
            console.error(`Error fetching submission data for ${username}:`, e);
            throw e;
        }
    }
}
