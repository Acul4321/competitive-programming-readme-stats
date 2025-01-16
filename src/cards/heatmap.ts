import { themes,Theme } from "../../themes/themes.ts";
import { Platform } from "../platform/platform.ts";
import { Card } from "./card.ts";

export class Heatmap extends Card {
    protected default_width: number = 400;
    protected default_height: number = 200;

    constructor(
        private platform: Platform,
        private data_type: string = "submission", //contest participation,submissions
        private yearly:boolean = false,
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

        if(yearly){ //if in day increments then double width to fit all squares
            this.width*=2;
        }

        if(border_radius == -1) {
            this.border_radius = 4.5;
        }
    }

    protected renderTitle(): string {
        return `<div id="title">${this.platform.profile.getId()}'s ${this.platform.platform_name} ${this.data_type}s</div>`;
    }
    protected renderBody(): string {
        return `
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
        `;
    }
}