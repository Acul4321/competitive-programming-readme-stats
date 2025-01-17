import { themes,Theme } from "../../themes/themes.ts";
import { Platform } from "../platform/platform.ts";
import { Card } from "./card.ts";

export class Heatmap extends Card {
    private square_number: number = 364; //for the week before the year mark
    private day_of_the_week:number = -1; //1-7 for the extra days added on to the year
    private square_scale: number = .055;
    private square_gap: number = 3;

    protected default_width: number = 800;
    protected default_height: number = 200;

    constructor(
        private platform: Platform,
        private data_type: string = "submission", //contest participation,submissions
        theme:Theme = themes["default"],
        show_icons: boolean = true,
        hide_border: boolean = false,
        width: number = 800,
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

        this.day_of_the_week = new Date().getDay();//current day
    }

    protected renderTitle(): string {
        return `<div id="title">${this.platform.profile.getId()}'s ${this.platform.platform_name} ${this.data_type}s</div>`;
    }
    protected renderBody(): string {
        return `
            <div id="square-body">
                ${this.displaySquares()}
            </div>
        `;
    }

    displaySquares(): string {
        let squares:string = "";
        let translateX:number;
        let translateY:number;
        for(let i=0;i<this.square_number;i++){ //weeks for majority of days
            translateY = (i % 7) * ((this.height*this.square_scale) + this.square_gap);
            translateX = Math.floor(i / 7) * ((this.height*this.square_scale) + this.square_gap);
            squares+=`
            <div id="square" style="transform: translate(${translateX}px,${translateY}px)"></div>
            `;
        }
        for(let i=0;i<this.day_of_the_week;i++){ //days of current week at the end
            translateY = (i % 7) * ((this.height*this.square_scale) + this.square_gap);
            translateX = Math.floor((i + this.square_number) / 7) * ((this.height*this.square_scale) + this.square_gap);
            squares+=`
            <div id="square" style="transform: translate(${translateX}px,${translateY}px)"></div>
            `;
        }
        return squares
    }

    protected override Style(): string {
        return `
            #title {
                color: #${this.theme.title_color};
                font-size: ${this.height/10}px;
                font-weight: 600;
                margin-bottom: 10px;
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

            /* Heatmap */
            #square-body {
                display: relative;
                flex-wrap: wrap;
                gap: 10px; /* Adjust spacing between squares */
                align-content: flex-start; /* Align the content to the start */
                position: relative;
            }

            #square-body::after {
                content: '';
                flex-basis: 100%; /* Forces a wrap */
                height: 0; /* Zero height for space-only wrapping */
            }

            #square {
                width: ${this.height*this.square_scale}px;
                height: ${this.height*this.square_scale}px;
                background-color: pink; /* Example color */
                margin-right: 5px; /* Adds right adjustment offset */
                position: absolute /* stack Above Mult adjust
            }
        `;
    }
}