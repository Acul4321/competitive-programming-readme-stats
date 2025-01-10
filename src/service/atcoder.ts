import { Service, Profile, Competition } from "./service.ts";

export class Atcoder extends Service {
    constructor() {
        super("https://atcoder.jp/user/");
    }

    fetchProfile(url: string): Profile {
        return new Profile("atcoder");
    }

    fetchCompetitionHistory(url: string): Competition[] {
        return [new Competition(new Date(), true, "contest_jp")];
    }
}
