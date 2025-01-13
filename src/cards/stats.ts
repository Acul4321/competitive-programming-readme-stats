import { Card } from './card.ts';
import { themes,Theme } from "../../themes/themes.ts";
import { formatDate } from "../utils.ts";
import { icons } from "../icons.ts";
import { Platform } from "../platform/platform.ts";

export class Stats extends Card {
    private rank_deg: number = 0;
    private rank_colour: string = "#000000";

    protected default_width: number = 450;
    protected default_height: number = 200;

    constructor(
        private platform: Platform,
        private use_rank_colour: boolean = false,
        theme:Theme = themes["default"],
        show_icons: boolean = true,
        hide_border: boolean = false,
        width: number = 450,
        height: number = 200,
        border_radius: number = 4.5
    ) {
        super(width, height, theme,show_icons,border_radius, hide_border);

        //TODO: optimise to be in main Card class
        if (width == -1 && height == -1) {
            this.width = this.default_width;
            this.height = this.default_height;
        } else if (width && height == -1) {
            this.height = width * (this.default_height/this.default_width);
        } else if (height && width == -1) {
            this.width = height * (this.default_width/this.default_height);
        }

        if(border_radius == -1) {
            this.border_radius = 4.5;
        }

        this.rank_colour = this.platform.getRankColour(this.platform.profile.getRating());
        this.rank_deg = 360 * this.platform.calcRatingBandProgress(this.platform.profile.getRating());
    }

    protected renderTitle(): string {
        return `<div id="title">${this.platform.profile.getId()}'s Atcoder Stats</div>`;
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
                color: #${this.theme.title_color};
                font-size: ${this.width/20}px;
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
            #competitions-history-body {
                width: 100%;
            }
            .border {
                height: 2px;
                background-color: rgb(228, 226, 226);
                margin: 5px 20px 0px;
            }
            .fadein {
                opacity: 0;
                animation-name: fadein;
                animation-duration: 0.8s;
                animation-timing-function: ease-in-out;
                animation-fill-mode: forwards;
            }
            @keyframes fadein {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            /* Stats */
            .stats-row {
                height: ${this.height/7}px;
                display: flex;
            }
            .stats-cell {
                font-size: ${this.width/30}px;
                font-weight: 700;
                display: flex;
                margin: auto auto auto 0px;
            }
            .stats-cell:nth-child(2) {
                text-align: right;
                margin: auto 0px auto auto;
            }
            .icon {
                width: ${this.width/25}px;
                height: ${this.height/12}px;
                margin: auto 5px auto 0px;
                color: ${this.theme.icon_color};
            }

            .container {
                width: ${this.width/5}px;
                height: ${this.height/2.2}px;
                text-align: center;
                display: relative;
                justify-content: center;
                align-items: center;
                margin-left: 20px;
            }
            .circle {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                display: absolute;
                justify-content: center;
                align-items: center;
                

                animation-name: conic-gradient;
                animation-duration: 0.8s;
                animation-fill-mode: forwards;
                background-image: radial-gradient(#${this.theme.bg_color} 60%, transparent 61%), conic-gradient(${this.use_rank_colour ? this.rank_colour : '#' + this.theme.title_color} ${this.rank_deg}deg, ${this.use_rank_colour ? this.rank_colour : '#' + this.theme.title_color}33 ${this.rank_deg}deg 360deg);
                mask-image: radial-gradient(
                    circle, 
                    transparent 59%, 
                    black 60%
                );
                mask-composite: intersect;
            }
            .rating {
                color: #${this.theme.text_color};
                display: absolute;
                transform: translateY(-130%);
            }
            .rating-label {
                font-size: ${this.width/30}px;
                font-weight: 600;
            }
            .rating-text {
                font-size: ${this.width/18}px;
                font-weight: 800;
            }

            @keyframes conic-gradient {
                {"".join(keyframes)}
            }
        `;
    }
}