export abstract class Platform {
    protected platform_url: string;
    public profile: Profile = new Profile('');
    
    public abstract platform_name: string;
    protected abstract platform_rating_bands: Map<number, Record<string, string>>;

    constructor(url: string, username: string) {
        this.platform_url = url;
    }

    public async initialize(username: string): Promise<void> {
        this.profile = await this.fetchProfile(username);
    }

    getUserURL(username: string): string {
        return this.platform_url + username;
    }

    public getPlatformBands(): Map<number, Record<string, string>>{
        return this.platform_rating_bands;
    }

    //rank colour
    getRankColour(rating: number): string {
        const bands = Array.from(this.platform_rating_bands.keys()).sort((a, b) => a - b);
        for (let i = 0; i < bands.length; i++) {
            if (rating <= bands[i]) {
                return this.platform_rating_bands.get(bands[i-1])?.colour ?? "#000000";
            }
        }
        return this.platform_rating_bands.get(bands[bands.length-1])?.colour ?? "#000000"; // If rank is higher than the highest
    }

    async getSourceHTML(username: string): Promise<string> {
        const response = (await fetch(this.getUserURL(username)));
        return response.text();
    }

    abstract fetchProfile(username: string): Promise<Profile>;
    abstract fetchCompetitionHistory(username: string): Promise<Competition[]>;
    abstract fetchSubmissions(username: string): Promise<Submission[]>;

}

export class Profile {
    protected id: string;
    protected rank?: number;
    protected rating?: number;
    protected highest_rating?: number;
    protected rated_matches?: number;
    protected last_competed?: Date;
    protected competition_history?: Competition[] = [];
    protected submissions?: Submission[] = [];

    constructor(
        id: string,
        rank?: number,
        rating?: number,
        highest_rating?: number,
        rated_matches?: number,
        last_competed?: Date,
        competition_history?: Competition[],
        submissions?:Submission[]
    ) {
        this.id = id;
        this.rank = rank;
        this.rating = rating;
        this.highest_rating = highest_rating;
        this.rated_matches = rated_matches;
        this.last_competed = last_competed;
        this.competition_history = competition_history;
        this.submissions = submissions;
    }

    // Getters
    getId(): string {
        return this.id;
    }
    getRank(): number {
        return this.rank ?? -1;
    }
    getRating(): number {
        return this.rating ?? -1;
    }
    getHighestRating(): number {
        return this.highest_rating ?? -1;
    }
    getRatedMatches(): number {
        return this.rated_matches ?? -1;
    }
    getLastCompeted(): Date {
        return this.last_competed ?? new Date();
    }
    getCompetitionHistory(): Competition[] {
        return this.competition_history ?? [];
    }
    getSubmissionHistory(): Submission[] {
        return this.submissions ?? [];
    }
}

export class Competition {
    protected contest_name: string;
    protected date: Date;
    protected is_rated: boolean;
    protected rank?: number;
    protected performance?: number;
    protected old_rating?: number;
    protected new_rating?: number;

    constructor(
        contest_name: string,
        date: Date,
        is_rated: boolean,
        rank?: number,
        performance?: number,
        old_rating?: number,
        new_rating?: number
    ) {
        this.contest_name = contest_name;
        this.date = date;
        this.is_rated = is_rated;
        this.rank = rank;
        this.performance = performance;
        this.old_rating = old_rating;
        this.new_rating = new_rating;
    }

    // Getters
    getContestName(): string {
        return this.contest_name;
    }
    getDate(): Date {
        return this.date;
    }
    getIsRated(): boolean {
        return this.is_rated;
    }
    getRank(): number | undefined {
        return this.rank;
    }
    getPerformance(): number | undefined {
        return this.performance;
    }
    getOldRating(): number | undefined {
        return this.old_rating;
    }
    getNewRating(): number | undefined {
        return this.new_rating;
    }
}

export class Submission {
    protected submission_time: Date;
    protected type: submissionType; //practice or contestant
    protected result: Result; // AC,TLE,
    protected language: Language; //enum of different prog lang
    protected points: number;
    protected problem_index: string; //uppercase aplphabet characters

    constructor(
        submission_time: Date,
        type: submissionType,
        result: Result,
        language: Language,
        points: number,
        problem_index: string
    ) {
        this.submission_time = submission_time;
        this.type = type;
        this.result = result;
        this.language = language;
        this.points = points;
        this.problem_index = problem_index;
    }

    // Getters
    getSubmissionTime(): Date {
        return this.submission_time;
    }
    getType(): submissionType {
        return this.type;
    }
    getResult(): Result {
        return this.result;
    }
    getLanguage(): Language {
        return this.language;
    }
    getPoints(): number {
        return this.points;
    }
    getProblemIndex(): string {
        return this.problem_index;
    }
}

export enum submissionType {
    CONTESTANT = "contestant",
    PRACTICE = "practice",
    NA = "N/A" //if not known
}

export enum Result {
    AC = "AC",   // Accepted
    TLE = "TLE", // Time Limit Exceeded
    MLE = "MLE", // Memory Limit Exceeded
    CE = "CE",   // Compilation Error
    RE = "RE",   // Runtime Error
    OLE = "OLE", // Output Limit Exceeded
    IE = "IE",   // Internal Error
    WA = "WA"    // Wrong Answer
}

export enum Language {
    Ada = "Ada",
    Awk = "Awk",
    Bash = "Bash",
    Brainfuck = "Brainfuck",
    C = "C",
    CPP = "C++",
    CSharp = "C#",
    Clang = "Clang",
    Clojure = "Clojure",
    COBOL = "COBOL",
    CommonLisp = "Common Lisp",
    Crystal = "Crystal",
    D = "D",
    Dart = "Dart",
    Elixir = "Elixir",
    Erlang = "Erlang",
    FSharp = "F#",
    Forth = "Forth",
    Fortran = "Fortran",
    Go = "Go",
    Haskell = "Haskell",
    Haxe = "Haxe",
    Java = "Java",
    JavaScript = "JavaScript",
    Julia = "Julia",
    Kotlin = "Kotlin",
    Lua = "Lua",
    Nim = "Nim",
    ObjectiveC = "Objective-C",
    OCaml = "OCaml",
    Octave = "Octave",
    Pascal = "Pascal",
    Perl = "Perl",
    PHP = "PHP",
    Prolog = "Prolog",
    Python = "Python",
    Racket = "Racket",
    Raku = "Raku",
    Ruby = "Ruby",
    Rust = "Rust",
    Scala = "Scala",
    Scheme = "Scheme",
    StandardML = "Standard ML",
    Swift = "Swift",
    Text = "Text",
    TypeScript = "TypeScript",
    Unlambda = "Unlambda",
    Vim = "Vim",
    VisualBasic = "Visual Basic"
}