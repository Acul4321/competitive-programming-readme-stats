import { Platform,Profile,Competition, Submission, Result, submissionType } from "./platform.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

export class Codeforces extends Platform {
    public override platform_name: string = "Codeforces";
    protected override platform_rating_bands: Map<number, Record<string, string>> = new Map([
        [0, { name: "Newbie", colour: "#CCCCCC" }],
        [1200, { name: "Pupil", colour: "#B2FA81" }],
        [1400, { name: "Specialist", colour: "#A2DABC" }],
        [1600, { name: "Expert", colour: "#ACACFB" }],
        [1900, { name: "Candidate Master", colour: "#E292FB" }],
        [2100, { name: "Master", colour: "#EECD8F" }],
        [2300, { name: "International Master", colour: "#EABD62" }],
        [2400, { name: "Grandmaster", colour: "#DD7F7B" }],
        [2600, { name: "International Grandmaster", colour: "#D6493E" }],
        [3000, { name: "Legendary Grandmaster", colour: "#8D1F12" }]
    ]);
    constructor() {
        super("https://codeforces.com/profile/");
    }

    async fetchProfile(username: string): Promise<Profile> {
        try{
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

            const rankResponse = await fetch("https://codeforces.com/api/user.ratedList?activeOnly=false&includeRetired=true");
            const rank_json =  await rankResponse.json();
            let rank;
            for( let i = 0; i < rank_json.result.length; i++) {
                if(rank_json.result[i].handle == username) {
                    rank = i+1;
                    break;
                }
            }
            
            //competition history
            const competition_history: Competition[] = await this.fetchCompetitionHistory(username);

            //submissions
            const submissions: Submission[] = await this.fetchSubmissions(username);

            return new Profile(
                username,
                rank,
                parseInt(rating),
                parseInt(highest_rating),
                parseInt(rated_matches),
                new Date(last_competed),
                competition_history,
                submissions
            );
        } catch (e) {
            console.error(`Error fetching profile for ${username}:`, e);
            throw e;
        }
    }

    async fetchCompetitionHistory(username: string): Promise<Competition[]> {
        try {
            const competitionHistory: Competition[] = [];

            let old_rating: number = 0;

            const contestSource = (await fetch("https://codeforces.com/contests/with/" + username + "?type=all")).text();
            const doc = new DOMParser().parseFromString(await contestSource, 'text/html');

            const rows = Array.from(doc.querySelectorAll("table")[5].querySelectorAll("tr")).reverse();
            console.log(rows);
            for(const row of rows) {
                let contest_name = '';
                let date = new Date();
                let is_rated = false;
                let rank = 0;
                const performance = -1;
                let new_rating = 0;

                const cells = row.querySelectorAll("td");
                for(let i = cells.length - 1; i >= 0; i--){ //this is a workaround to get the data from the table
                    const cell = cells[i];
                    if(i == 1){
                        contest_name = cell.textContent.trim();
                    } else if (i == 2){
                        date = new Date(cell.textContent.trim());
                    } else if (i == 3){
                        if(cell.textContent.trim() == '—'){
                            is_rated = false;
                            competitionHistory.push(new Competition(contest_name, date, is_rated));
                            continue;
                        } else{
                            is_rated = true;
                            rank = parseInt(cell.textContent.trim());
                        }
                    } else if (i == 6){
                        new_rating = parseInt(cell.textContent.trim());
                    }
                }
                if (is_rated) {
                    competitionHistory.push(new Competition(contest_name, date, is_rated, rank, performance, old_rating, new_rating));
                    old_rating = new_rating;
                }
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
    
            const contentSource = await fetch("https://codeforces.com/api/user.status?handle=" + username);
            const submission_json = await contentSource.json();
    
            for (const sub of submission_json.result) {
                const submission = new Submission(
                    new Date(sub.creationTimeSeconds * 1000),
                    sub.author.participantType === "CONTESTANT" ? submissionType.CONTESTANT : submissionType.PRACTICE,
                    sub.verdict === "OK" ? Result.AC : 
                        sub.verdict === "TIME_LIMIT_EXCEEDED" ? Result.TLE :
                        sub.verdict === "MEMORY_LIMIT_EXCEEDED" ? Result.MLE :
                        sub.verdict === "COMPILATION_ERROR" ? Result.CE :
                        sub.verdict === "RUNTIME_ERROR" ? Result.RE :
                        sub.verdict === "WRONG_ANSWER" ? Result.WA : Result.IE,
                    sub.programmingLanguage,
                    sub.problem.rating || 0,
                    sub.problem.index
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
