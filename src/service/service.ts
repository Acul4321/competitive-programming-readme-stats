export abstract class Service {
    protected service_url: string;
    protected profile: Profile = new Profile('');

    constructor(url: string) {
        this.service_url = url;
    }

    abstract fetchProfile(url: string): Profile;
    abstract fetchCompetitionHistory(url: string): Competition[];

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