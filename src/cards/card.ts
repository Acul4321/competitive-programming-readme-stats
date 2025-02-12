import { Theme } from "../../themes/themes.ts";

export abstract class Card {
    public abstract readonly default_width: number;
    public abstract readonly default_height: number;
    public abstract readonly default_border_radius: number;

    public width: number | undefined;
    public height: number | undefined;
    public border_radius: number | undefined;
    public show_icons: boolean;
    public hide_border: boolean;
    public use_rank_colour: boolean;
    public theme: Theme;

    constructor(
        show_icons: boolean,
        hide_border: boolean,
        use_rank_colour: boolean,
        theme: Theme,
        params?: { width? : number, height? : number, border_radius? : number }
    ) {
        this.show_icons = show_icons;
        this.hide_border = hide_border;
        this.use_rank_colour = use_rank_colour;
        this.theme = theme;
        this.border_radius = params?.border_radius ?? undefined;
        this.width = params?.width ?? undefined;
        this.height = params?.height ?? undefined;
    }

    protected initDefaultParams(): void {
        this.calcCardDimensions(this.width, this.height);
        this.setBorderRadius(this.border_radius);
    }

    protected calcCardDimensions(width: number | undefined = undefined, height: number | undefined = undefined): void {
        const aspectRatio : number = this.default_width / this.default_height;

        if(width === undefined && height === undefined){
            this.width = this.default_width;
            this.height = this.default_height;
        }else if (width !== undefined && height === undefined) {
            this.width = width;
            this.height = width / aspectRatio;
        } else if (height !== undefined && width === undefined) {
            this.height = height;
            this.width = height * aspectRatio;
        } else if (width !== undefined && height !== undefined) {
            this.width = width;
            this.height = height;
        }
    }

    protected setBorderRadius(border_radius: number | undefined = undefined): void {
        if(this.border_radius === undefined){
            this.border_radius = this.default_border_radius;
        }
    }

    protected abstract renderTitle(): string;
    protected abstract renderBody(): string;

    // subclass optional extra styling
    protected Style(): string {
        return ``;
    }
    
    public render(): string {
        this.initDefaultParams();

        // runtime check to ensure values are defined
        if (this.width === undefined || this.height === undefined || this.border_radius === undefined) {
            throw new Error('Card dimensions and border radius must be defined before rendering');
        }
        //base styling
        const style = `
            #svg-body {
                margin: 0;
                font-family: Segoe UI;
                color: #${this.theme.text_color};
            }
            #card {
                width: ${this.width - 2}px;
                height: ${this.height - 2}px;
                
                display: flex;
                position: relative;
                background-color: #${this.theme.bg_color};
    
                border: ${this.hide_border === false ? 1 : 0}px solid rgb(228, 226, 226);
                border-radius: ${this.border_radius}px;
            }
            #card-body {
                margin: ${Math.min(this.width/20,20)}px;
                width: ${this.width - 40}px;
                height: ${this.height - 40}px;
                display: flex;
                flex-direction: column;
            }
            #title-container {
                height: auto;
            }
            #body-container {
                height: calc(100% - 35px);
            }
            ${this.Style()}
        `;    
        
        return `
            <svg
            viewBox="0 0 ${this.width} ${this.height}"
            width="${this.width}"
            height="${this.height}"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >

            <foreignObject x="0" y="0" width="${this.width}" height="${this.height}" overflow="auto">
            <body id="svg-body" xmlns="http://www.w3.org/1999/xhtml">
                <div id="card">
                <div id="card-body">
                    <div id="title-container">
                    ${this.renderTitle()}
                    </div>
                    <div id="body-container">
                    ${this.renderBody()}
                    </div>
                </div>
                </div>
            </body>
            </foreignObject>
            <style>${style}</style>
            </svg>
        `;
    }
    
}