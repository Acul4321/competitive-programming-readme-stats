import { Card } from './card.ts';
import { themes,Theme } from "../../themes/themes.ts";
import { formatDate } from "../utils.ts";

export class Stats extends Card {
    private rank_deg: number = 0;

    constructor(
        private title: string,
        private rank: number,
        private rating: number,
        private max_rating: number,
        private rated_matches: number,
        private last_competed: Date,
        theme:Theme = themes["default"],
        show_icons: boolean = true,
        hide_border: boolean = false,
        width: number = 450,
        height: number = 200,
        border_radius: number = 4.5
    ) {
        super(width, height, theme,show_icons,border_radius, hide_border);
        //dimention validation
        if(width == -1){
            width = 450;
        }
        if(height == -1){
            height = 200;
        }
        if(border_radius == -1){
            border_radius = 4.5;
        }

        this.calcRankRingDeg();
    }

    protected calcRankRingDeg(): void {
        this.rank_deg = ((this.rating % 400) / 400) * 360; //atcoder rating is always interval [0, 400)
    }

    protected renderTitle(): string {
        return `<div id="title">${this.title}'s Atcoder Stats</div>`;
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
                        <div id="rank-label">Rank:</div>
                    </td>
                    <td class="stats-cell" id="rank-value">${this.rank}</td>
                </tr>
                <tr class="stats-row">
                    <td class="stats-cell">
                        <div id="max_rating-label">Max Rating:</div>
                    </td>
                    <td class="stats-cell" id="max_rating-value">${this.max_rating}</td>
                </tr>
                <tr class="stats-row">
                    <td class="stats-cell">
                        <div id="rated_matches-label">Rated Matches:</div>
                    </td>
                    <td class="stats-cell" id="rated_matches-value">${this.rated_matches}</td>
                </tr>
                <tr class="stats-row">
                    <td class="stats-cell">
                        <div id="last_competed-label">Last Competed:</div>
                    </td>
                    <td class="stats-cell" id="last_competed-value">${formatDate(this.last_competed)}</td>
                </tr>
            </table>
        `;
    }

    renderRatingCircle(): string {
        return `
            <div class="container">
                <div class="circle">
                    <div class="rating">
                        <span class="rating-label">Rating</span>
                        <br />
                        <span class="rating-text">${this.rating}</span>
                    </div>
                </div>
            </div>
        `;
    }
    

    protected override Style(): string {
        console.log(this.rank_deg);
        return `
            #title {
                color: #${this.theme.title_color};
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 10px;
            }
            #stats-body {
                display: flex;
                flex-direction: row;
            }
            #stats {
                width: 100%;
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
                height: 28px;
                display: flex;
            }
            .stats-cell {
                font-size: 16px;
                font-weight: 700;
                display: flex;
                margin: auto auto auto 0px;
            }
            .stats-cell:nth-child(2) {
                text-align: right;
                margin: auto 0px auto auto;
            }
            .icon {
                width: 18px;
                height: 18px;
                margin: auto 5px auto 0px;
                color: {self._option.theme.icon_color};
            }

            .container {
                width: 95px;
                height: 95px;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 20px;
            }
            .circle {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;

                animation-name: conic-gradient;
                animation-duration: 0.8s;
                animation-fill-mode: forwards;
                background-image: radial-gradient(#${this.theme.bg_color} 60%, transparent 61%), conic-gradient(#${this.theme.title_color} ${this.rank_deg}deg, #${this.theme.title_color}33 ${this.rank_deg}deg 360deg);
            }
            .rating {
                color: #${this.theme.title_color};
            }
            .rating-label {
                font-size: 16px;
                font-weight: 600;
            }
            .rating-text {
                font-size: 24px;
                font-weight: 800;
            }

            @keyframes conic-gradient {
                {"".join(keyframes)}
            }
        `;
    }
}