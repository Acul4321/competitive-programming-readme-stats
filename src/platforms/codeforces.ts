import { Console } from "node:console";
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
    constructor(username: string) {
        super("https://codeforces.com/profile/",username);
    }

    async fetchProfile(username: string): Promise<Profile> {
        try{
            //get source
            const source = await this.getSourceHTML(username);
            let doc = new DOMParser().parseFromString(source, 'text/html');

            // populate profile
            const profileResponse = await fetch("https://codeforces.com/api/user.info?handles=" + username);
            const profile_json = await profileResponse.json();
            const rating = profile_json.result.rating;
            const highest_rating = profile_json.result.maxRating;

            const contestResponse = await fetch("https://codeforces.com/api/user.rating?handle=" + username);
            const contest_json = await contestResponse.json();
            const rated_matches = contest_json.result.length;
            const last_competed = (Math.max(...contest_json.result.map((contest: any) => contest.ratingUpdateTimeSeconds))) * 1000; // Convert seconds to milliseconds

            let rank = -1;
            try {
                const rankResponse = await fetch("https://codeforces.com/api/user.ratedList?activeOnly=false&includeRetired=true");
                const rank_json =  await rankResponse.json();
                for( let i = 0; i < rank_json.result.length; i++) {
                    if(rank_json.result[i].handle == username) {
                        rank = i+1;
                        break;
                    }
                }
            } catch (error) {
                console.log("No Rank Found");
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

            const contestResponse = await fetch("https://codeforces.com/api/user.rating?handle=" + username);
            const contest_json = await contestResponse.json();

            if (contest_json.status === "OK") {
                for (const contest of contest_json.result) {
                    const competition = new Competition(
                        contest.contestName,
                        new Date(contest.ratingUpdateTimeSeconds * 1000), // Convert seconds to milliseconds
                        true, // All contests from API are rated
                        contest.rank,
                        -1, // performance is not provided by API
                        contest.oldRating,
                        contest.newRating
                    );
                    competitionHistory.push(competition);
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
