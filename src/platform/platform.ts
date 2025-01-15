export abstract class Platform {
    protected platform_url: string;
    public profile: Profile = new Profile('');
    
    public abstract platform_name: string;
    protected abstract platform_rating_bands: Map<number, Record<string, string>>;

    constructor(url: string) {
        this.platform_url = url;
    }
    getUserURL(username: string): string {
        return this.platform_url + username;
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

    // Stats rank ring degrees calculation
    calcRatingBandProgress(rating: number): number{ //returns the progress(0-1) from the previous band to the next
        const bands = Array.from(this.platform_rating_bands.keys()).sort((a, b) => a - b);
        for (let i = 0; i < bands.length - 1; i++) {
            if (rating >= bands[i] && rating < bands[i + 1]) {
                return (rating - bands[i]) / (bands[i + 1] - bands[i]);
            }
        }
        return 1; // If rank is higher than the highest band
    }

    async getSourceHTML(username: string): Promise<string> {
        const response = (await fetch(this.getUserURL(username)));
        return response.text();
    }

    abstract fetchProfile(username: string): Promise<Profile>;
    abstract fetchCompetitionHistory(username: string): Promise<Competition[]>;

}

export class Profile {
    protected id: string;
    protected rank?: number;
    protected rating?: number;
    protected highest_rating?: number;
    protected rated_matches?: number;
    protected last_competed?: Date;
    protected competition_history?: Competition[] = [];

    constructor(
        id: string,
        rank?: number,
        rating?: number,
        highest_rating?: number,
        rated_matches?: number,
        last_competed?: Date,
        competition_history?: Competition[]
    ) {
        this.id = id;
        this.rank = rank;
        this.rating = rating;
        this.highest_rating = highest_rating;
        this.rated_matches = rated_matches;
        this.last_competed = last_competed;
        this.competition_history = competition_history;
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
}