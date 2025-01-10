import { Card } from './card.ts';
import { themes } from "../../themes/themes.ts";
import { formatDate } from "../utils.ts";

export class Stats extends Card {
    protected renderTitle(): string {
        return `
            <div id="title-container">
                <h2 style="color: ${this.theme.title_color};">${this.title}</h2>
            </div>
        `;
    }
    protected renderBody(): string {
        return `
            <div id="body-container">
                <h3 style="color: ${this.theme.text_color};">Rank: ${this.rank}</h3>
                <h3 style="color: ${this.theme.text_color};">Rating: ${this.rating}</h3>
                <h3 style="color: ${this.theme.text_color};">Max Rating: ${this.maxRating}</h3>
                <h3 style="color: ${this.theme.text_color};">Rated Matches: ${this.rated_matches}</h3>
                <h3 style="color: ${this.theme.text_color};">Last Competed: ${formatDate(this.last_competed)}</h3>
            </div>
        `;
    }
    constructor(
        private title: string,
        private rank: number,
        private rating: number,
        private maxRating: number,
        private rated_matches: number,
        private last_competed: Date,
        theme = themes["default"],
        hide_border: boolean = false,
        width: number = 100,
        height: number = 100,
        border_radius: number = 4.5
    ) {
        super(width, height, border_radius, theme, hide_border);
    }
}