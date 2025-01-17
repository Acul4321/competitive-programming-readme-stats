import { randomInt } from "node:crypto";
import { themes,Theme } from "../../themes/themes.ts";
import { Result } from "../platform/platform.ts";
import { Platform } from "../platform/platform.ts";
import { rgbToHex,hexToRgb, RGB } from "../utils.ts";
import { Card } from "./card.ts";

export class Heatmap extends Card {
    private square_number: number = 364; //for the week before the year mark
    private day_of_the_week:number = -1; //1-7 for the extra days added on to the year
    private square_scale: number = .055;
    private square_gap: number = 3;
    private data_freq:Array<number> = []; //the number of contest participated or AC submissions on that day
    private colour_count: number = 5;//how many colours the palette will have
    private colour_palette:Map<number,string> = new Map<number,string>();

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
        this.data_freq = this.calcDataFreq();
        this.colour_palette = this.createPalette(this.theme.text_color); // colour peram will be middle value with 3 above and below in tone
    }

    createPalette(base_hex_colour: string): Map<number,string> {
        const palette = new Map<number,string>();
        
        //calculate empty square colour
        const bg_rgb = hexToRgb(this.theme.bg_color);
        const darker_bg_rgb: RGB = {
            r: bg_rgb.r * 2,
            g: bg_rgb.g * 2,
            b: bg_rgb.b * 2
        };
        palette.set(0,rgbToHex(darker_bg_rgb));

        // Convert base color to RGB
        const base_rgb: RGB = hexToRgb(base_hex_colour);
        
        // Calculate darkest and lightest colors
        const darker_rgb: RGB = { 
            r: Math.floor(base_rgb.r / 2), 
            g: Math.floor(base_rgb.g / 2), 
            b: Math.floor(base_rgb.b / 2) 
        };
        
        const lighter_rgb: RGB = { 
            r: Math.min(255, Math.floor(base_rgb.r * 1.5)), 
            g: Math.min(255, Math.floor(base_rgb.g * 1.5)), 
            b: Math.min(255, Math.floor(base_rgb.b * 1.5)) 
        };
    
        // Calculate step sizes
        const steps_to_base = Math.ceil((this.colour_count-1)/2);  // 3 steps from lighter to base
        const r_step1 = (base_rgb.r - lighter_rgb.r) / steps_to_base;
        const g_step1 = (base_rgb.g - lighter_rgb.g) / steps_to_base;
        const b_step1 = (base_rgb.b - lighter_rgb.b) / steps_to_base;
        
        const r_step2 = (darker_rgb.r - base_rgb.r) / steps_to_base;
        const g_step2 = (darker_rgb.g - base_rgb.g) / steps_to_base;
        const b_step2 = (darker_rgb.b - base_rgb.b) / steps_to_base;

        // generate palette colors
        for(let i = 0; i < this.colour_count; i++) {
            let r, g, b;
            if(i < steps_to_base) {
                r = Math.floor(lighter_rgb.r + (r_step1 * i));
                g = Math.floor(lighter_rgb.g + (g_step1 * i));
                b = Math.floor(lighter_rgb.b + (b_step1 * i));
            } else if(i === steps_to_base) {
                r = base_rgb.r;
                g = base_rgb.g;
                b = base_rgb.b;
            } else {
                r = Math.floor(base_rgb.r + (r_step2 * (i-steps_to_base)));
                g = Math.floor(base_rgb.g + (g_step2 * (i-steps_to_base)));
                b = Math.floor(base_rgb.b + (b_step2 * (i-steps_to_base)));
            }
            
            // convert RGB to hex and store in map
            const rgb: RGB = {
                r: Math.max(0, Math.min(255, r)),
                g: Math.max(0, Math.min(255, g)), 
                b: Math.max(0, Math.min(255, b))
            };
            
            palette.set(i+1, rgbToHex(rgb));
        }
    
        return palette;
    }

    getPaletteColour(occurrences: number): string {
        // return this.colour_palette.get(randomInt(0,this.colour_count-1)) ?? this.theme.text_color;
        if (occurrences > this.colour_palette.size-1) {
            occurrences = this.colour_palette.size-1;
        }
        return this.colour_palette.get(occurrences) ?? '#'+this.theme.title_color;
    }
    
    calcDataFreq(): number[] {
        const today: Date = new Date();
        const past_date: Date = new Date(today);
        past_date.setDate(today.getDate() - (this.day_of_the_week + this.square_number));

        // Calculate days of each square
        const days = this.getDaysBetweenDates(past_date, today);
        let freq: number[] = new Array(this.square_number + this.day_of_the_week).fill(0);
        const data: Date[] = []; // For either submission dates or competition dates

        // Populate data with days of AC submissions or competition participations
        if (this.data_type == "submission") {
            for (const sub of this.platform.profile.getSubmissionHistory()) {
                if (sub.getResult() == Result.AC) {
                    data.push(sub.getSubmissionTime());
                }
            }
        } else {
            for (const cont of this.platform.profile.getCompetitionHistory()) {
                data.push(cont.getDate());
            }
        }

        // Loop through the data array and update the freq array
        for (const date of data) {
            for (const [index, day] of days.entries()) {
                if (date.toDateString() === day.toDateString()) {
                    freq[index]++;
                    break;
                }
            }
        }

        return freq;
    }

    getDaysBetweenDates(startDate: Date, endDate: Date): Map<number, Date> {
        const dates: Map<number, Date> = new Map();
        const currentDate = new Date(startDate);
        let index = 0;
    
        while (currentDate <= endDate) {
            dates.set(index-1, new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
            index++;
        }
    
        return dates;
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
            <div id="square" style="transform: translate(${translateX}px,${translateY}px);background-color:${this.getPaletteColour(this.data_freq[i])}"></div>
            `;
        }
        for(let i=0;i<this.day_of_the_week;i++){ //days of current week at the end
            translateY = (i % 7) * ((this.height*this.square_scale) + this.square_gap);
            translateX = Math.floor((i + this.square_number) / 7) * ((this.height*this.square_scale) + this.square_gap);
            squares+=`
            <div id="square" style="transform: translate(${translateX}px,${translateY}px);background-color:${this.getPaletteColour(this.data_freq[i])}"></div>
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
                margin-right: 5px; /* Adds right adjustment offset */
                position: absolute /* stack Above Mult adjust
            }
        `;
    }
}