export abstract class Platform {
    protected platform_url: string;
    public profile: Profile = new Profile('');

    protected abstract platform_rating_bands: Map<number, Record<string, string>>;

    constructor(url: string) {
        this.platform_url = url;
    }
    getUserURL(username: string): string {
        return this.platform_url + username;
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
    abstract fetchCompetitionHistory(url: string): Promise<Competition[]>;

}

export class Profile {
    protected id: string;
    protected rank?: number;
    protected rating?: number;
    protected highest_rating?: number;
    protected rated_matches?: number;
    protected last_competed?: Date;
    protected competition_history: Competition[] = [];

    constructor(
        id: string,
        rank?: number,
        rating?: number,
        highest_rating?: number,
        rated_matches?: number,
        last_competed?: Date
    ) {
        this.id = id;
        this.rank = rank;
        this.rating = rating;
        this.highest_rating = highest_rating;
        this.rated_matches = rated_matches;
        this.last_competed = last_competed;
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
}

export class Competition {
    protected date: Date;
    protected is_rated: boolean;
    protected contest_jp: string;
    protected contest_en?: string;
    protected rank?: number;
    protected performance?: number;
    protected old_rating?: number;
    protected new_rating?: number;

    constructor(
        date: Date,
        is_rated: boolean,
        contest_jp: string,
        contest_en?: string,
        rank?: number,
        performance?: number,
        old_rating?: number,
        new_rating?: number
    ) {
        this.date = date;
        this.is_rated = is_rated;
        this.contest_jp = contest_jp;
        this.contest_en = contest_en;
        this.rank = rank;
        this.performance = performance;
        this.old_rating = old_rating;
        this.new_rating = new_rating;
    }
}