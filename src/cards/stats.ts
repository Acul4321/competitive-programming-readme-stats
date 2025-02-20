import { Theme } from "../../themes/themes.ts";
import { Platform } from "../platforms/platform.ts";
import { Card } from "./card.ts";

import { icons } from "../icons.ts";
import { formatDate } from "../utils.ts";


export class StatsCard extends Card {
    override readonly default_width: number = 200;
    override readonly default_height: number = 100;
    override readonly default_border_radius: number = 10;

    private rank_deg: number = 0;
    private rank_colour: string = "#000000";

    public platform : Platform;
    public hide_values : string[] = [];

    constructor(
        show_icons: boolean,
        hide_border: boolean,
        use_rank_colour: boolean,
        theme: Theme,
        platform: Platform,
        params?: { width? : number, height? : number, border_radius? : number, hide? : string}
    ) {
        super(show_icons, hide_border, use_rank_colour, theme, params);
        this.platform = platform;
        
        this.rank_colour = this.platform.getRankColour(this.platform.profile.getRating());
        this.rank_deg = 360 * this.platform.calcRatingBandProgress(this.platform.profile.getRating());

        //parse hide
        if (params && params.hide) {
            params.hide.split(",").forEach((value: string) => {
                this.hide_values.push(value);
            });
        }

    }

    protected renderTitle(): string {
        return `<div id="title">${this.platform.profile.getId()}'s ${this.platform.platform_name} Stats</div>`;
    }

    protected renderBody(): string {
        return `
            <div id="stats-body">
                <div id="stats">
                    ${this.renderStats()}
                </div>
                <div id="rank-circle">
                    ${this.renderRatingCircle()}
                </div>
            </div>
        `;
    }

    renderStats(): string {
        return `
            <table style="width: 100%">
                <tr class="stats-row">
                    <td class="stats-cell">
                        ${this.show_icons === true ? '<div class="icon">' + icons.rank + '</div>' : ""}
                        <div id="rank-label">Rank:</div>
                    </td>
                    <td class="stats-cell" id="rank-value">${this.platform.profile.getRank()}</td>
                </tr>
                <tr class="stats-row">
                    <td class="stats-cell">
                        ${this.show_icons === true ? '<div class="icon">' + icons.max_rating + '</div>' : ""}
                        <div id="max_rating-label">Max Rating:</div>
                    </td>
                    <td class="stats-cell" id="max_rating-value">${this.platform.profile.getHighestRating()}</td>
                </tr>
                <tr class="stats-row">
                    <td class="stats-cell">
                        ${this.show_icons === true ? '<div class="icon">' + icons.rated_matches + '</div>' : ""}
                        <div id="rated_matches-label">Rated Matches:</div>
                    </td>
                    <td class="stats-cell" id="rated_matches-value">${this.platform.profile.getRatedMatches()}</td>
                </tr>
                <tr class="stats-row">
                    <td class="stats-cell">
                        ${this.show_icons === true ? '<div class="icon">' + icons.last_competed + '</div>' : ""}
                        <div id="last_competed-label">Last Competed:</div>
                    </td>
                    <td class="stats-cell" id="last_competed-value">${formatDate(this.platform.profile.getLastCompeted())}</td>
                </tr>
            </table>
        `;
    }

    renderRatingCircle(): string {
        return `
            <div class="container">
                <div class="circle">
                </div>
                <div class="rating">
                    <span class="rating-label">Rating</span>
                    <br />
                    <span class="rating-text">${this.platform.profile.getRating()}</span>
                </div>
            </div>
        `;
    }
    
     protected override Style(): string {
        return `
            #title {
                color: ${this.theme.title_color};
                font-size: 10px;
                font-weight: 600;
                margin-bottom: 10px;
            }
            #stats-body {
                display: flex;
                flex-direction: row;
            }
            #stats {
                width: 60%;
            }
            #rank-circle {
                width: 40%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            /* Stats */
            .stats-row {
                height: 12px;
                display: flex;
            }
            .stats-cell {
                font-size: 6px;
                font-weight: 700;
                display: flex;
                margin: auto auto auto 0px;
            }
            .stats-cell:nth-child(2) {
                text-align: right;
                margin: auto 0px auto auto;
            }
            .icon {
                width: 6px;
                height: 6px;
                margin: auto 5px auto 0px;
                color: ${this.theme.icon_color};
            }

            .container {
                width: 55px;
                height: 55px;
                text-align: center;
                display: relative;
                justify-content: center;
                align-items: center;
                margin-left: 20px;
            }
            .circle {
                width: 100%;
                aspect-ratio: 1 / 1;
                border-radius: 50%;
                display: absolute;
                justify-content: center;
                align-items: center;

                background-image: radial-gradient(${this.theme.bg_color} 60%, transparent 61%), conic-gradient(${this.use_rank_colour ? this.rank_colour : this.theme.title_color} ${this.rank_deg}deg, ${this.use_rank_colour ? this.rank_colour : this.theme.title_color}33 ${this.rank_deg}deg 360deg);
                mask-image: radial-gradient(
                    circle, 
                    transparent 59%, 
                    black 60%
                );
                mask-composite: intersect;
            }
            .rating {
                color: ${this.theme.text_color};
                display: absolute;
                transform: translateY(-49px);
            }
            .rating-label {
                font-size: 8px;
                font-weight: 500;
            }
            .rating-text {
                font-size: 15px;
                font-weight: 800;
            }

        `;
    }
}