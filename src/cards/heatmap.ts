import { getTheme,Theme } from "../../themes/themes.ts";
import { Result,Platform } from "../platforms/platform.ts";
import { Card } from "./card.ts";

export class HeatmapCard extends Card {
    override readonly default_width: number = 400;
    override readonly default_height: number = 100;
    override readonly default_border_radius: number = 10;

    private square_number: number = 364; //for the week before the year mark
    private day_of_the_week:number = -1; //1-7 for the extra days added on to the year
    private square_scale: number = .055;
    private square_gap: number = 3;
    private data_freq:Array<number> = []; //the number of contest participated or AC submissions on that day
    private colour_count: number = 5;//how many colours the palette will have
    private colour_palette:Map<number,string> = new Map<number,string>();


    public platform : Platform;
    public data_type : string = "submission"; //contest participation,submissions

    constructor(
        show_icons: boolean,
        hide_border: boolean,
        use_rank_colour: boolean,
        theme: Theme,
        platform: Platform,
        params?: { width? : number, height? : number, border_radius? : number, data_type? : string}
    ) {
        super(show_icons, hide_border, use_rank_colour, theme, params);
        this.platform = platform;

        //parse data_type
        if(params && params.data_type){
            this.data_type = params.data_type;
        }
        
        this.square_gap= this.width/266.67;
        this.day_of_the_week = new Date().getDay();//current day
        this.data_freq = this.calcDataFreq();
        this.colour_palette = this.createPalette(this.theme.text_color); // colour peram will be middle value with 3 above and below in tone
    }

    createPalette(base_hex_colour: string): Map<number,string> {
        const palette = new Map<number,string>();
        
        //calculate empty square colour
        const bg_rgb = hexToRgb(this.theme.bg_color);
        if(!bg_rgb.a){
            bg_rgb.a = 1;
        }
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
        const freq: number[] = new Array(this.square_number + this.day_of_the_week).fill(0);
        const data: Map<string, number> = new Map(); // Map to store date and occurrences

        // Populate data with days of AC submissions or competition participations
        if (this.data_type == "submission") {
            for (const sub of this.platform.profile.getSubmissionHistory()) {
                if (sub.getResult() == Result.AC) {
                    const dateStr = sub.getSubmissionTime().toDateString();
                    data.set(dateStr, (data.get(dateStr) ?? 0) + 1);
                }
            }
        } else {
            for (const cont of this.platform.profile.getCompetitionHistory()) {
                const dateStr = cont.getDate().toDateString();
                data.set(dateStr, (data.get(dateStr) ?? 0) + 1);
            }
        }

        // Loop through the data map and update the freq array
        for (const [dateStr, count] of data.entries()) {
            for (const [index, day] of days.entries()) {
                if (dateStr === day.toDateString()) {
                    freq[index-1] = count;
                    break;
                }
            }
        }

        return freq;
    }

    getDaysBetweenDates(startDate: Date, endDate: Date): Map<number, Date> {
        const dates: Map<number, Date> = new Map();
        const currentDate = new Date(startDate);
        let index = 1;
    
        while (currentDate <= endDate) {
            dates.set(index-1, new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
            index++;
        }
        return dates;
    }



    protected renderTitle(): string {
        return `
            <div id="title" >${this.platform.profile.getId()}'s ${this.platform.platform_name} ${this.data_type}s</div>
            <div id="palette-showcase">${this.displayShowcase()}</div>
        `;
    }
    protected renderBody(): string {
        return `
            <div id="square-body">
                ${this.displaySquares()}
            </div>
            <div id="label-body">
                <div id="label-date">${this.displayDate()}</div>
                <div id="label-month">${this.displayMonth()}</div>
            </div>
        `;
    }

    displaySquares(): string {
        let squares:string = "";
        let translateX:number;
        let translateY:number;
        const startingX:number = this.width/50;
        const startingY:number = 0;
        for(let i=0;i<this.square_number;i++){ //weeks for majority of days
            translateY = (i % 7) * (((this.width/4)*this.square_scale) + this.square_gap);
            translateX = Math.floor(i / 7) * (((this.width/4)*this.square_scale) + this.square_gap);
            squares+=`
            <div id="square" style="transform: translate(${translateX + startingX}px,${translateY + startingY}px);background-color:${this.getPaletteColour(this.data_freq[i])}"></div>
            `;
        }
        for(let i=0;i<this.day_of_the_week;i++){ //days of current week at the end
            translateY = (i % 7) * ((this.height*this.square_scale) + this.square_gap);
            translateX = Math.floor((i + this.square_number) / 7) * ((this.height*this.square_scale) + this.square_gap);
            squares+=`
            <div id="square" style="transform: translate(${translateX + startingX}px,${translateY + startingY}px);background-color:${this.getPaletteColour(this.data_freq[i])}"></div>
            `;
        }
        return squares
    }

    displayShowcase(): string{
        let palette_showcase : string = "";
        const showcase_start: number = this.width/5;
        for(let i = 0;i < this.colour_palette.size+2;i++){ //+2 for labels at end and start
            if(i == 0) {
                palette_showcase += `
                <div id="label" style="transform: translate(-${showcase_start-(i*this.width/50) + (this.width/27)}px,-${(this.height/40)*2}px)">Less</div>
                `;
            } else if( i == this.colour_palette.size+1){
                palette_showcase += `
                    <div id="label" style="transform: translate(-${showcase_start-(i*(this.width/50)) + (this.width/41)}px,-${(this.height/40)*2}px)">More</div>
            `;   
            }
            palette_showcase += `
            <div id="square" style="background-color:${this.colour_palette.get(i)};transform: translate(-${showcase_start-(i*(this.width/50))}px,-${this.height/40}px)"></div>
            `;   
        }


        return palette_showcase;
    }

    displayDate() : string {
        let return_date: string = "";
        const date_labels: Array<string> = ["Tue", "Thu", "Sat"];

        for(let i=0;i<date_labels.length;i++){
            return_date += `
                <div id="label" style="transform:translate(-${this.width/90}px,${(i*(this.height/7.5))+this.height/20}px)">${date_labels[i]}</div>
            `;
        }

        return return_date
    }

    displayMonth(): string {
        let return_month: string = "";
        const month: Map<number, string> = new Map([
            [0, "Jan"], [1, "Feb"], [2, "Mar"], [3, "Apr"], [4, "May"], [5, "Jun"],
            [6, "Jul"], [7, "Aug"], [8, "Sep"], [9, "Oct"], [10, "Nov"], [11, "Dec"]
        ]);

        const today: Date = new Date();
        const past_date: Date = new Date(today);
        past_date.setDate(today.getDate() - (this.day_of_the_week + this.square_number));

        let currentMonth = -1;
        const days = this.getDaysBetweenDates(past_date, today);

        for (const [index, day] of days.entries()) {
            const monthIndex = day.getMonth();
            if (monthIndex !== currentMonth && day.getDate() <= 7) {
                currentMonth = monthIndex;
                const translateX = Math.floor(index / 7) * ((this.height * this.square_scale) + this.square_gap);
                return_month += `
                    <div id="label" style="transform:translate(${translateX + 20}px,${this.height-(this.height/2)}px)">${month.get(monthIndex)}</div>
                `;
            }
        }

        return return_month;
    }

    protected override Style(): string {
        return `
            #title {
                color: #${this.theme.title_color};
                font-size: ${this.height/10}px;
                font-weight: 600;
                margin-bottom: ${this.height/20}px;
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
            
            #title, #palette-showcase {
                display: inline-flex; /* Ensures the div content remains inline */
            }

            #title-container {
                display: flex;
                justify-content: space-between;
                align-items: center; /* Ensures proper vertical alignment if needed */
            }
            
            #label { 
                font-size: ${this.height/15}px;
                position: absolute;
            }
                `;
    }
}