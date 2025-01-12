import { themes,Theme } from "../../themes/themes.ts";
export abstract class Card {
    protected width: number;
    protected height: number;
    protected theme: Theme;
    protected show_icons: boolean;
    protected border_radius: number;
    protected hide_border: boolean;

    protected abstract default_width: number;
    protected abstract default_height: number;

    constructor(
        width: number = 100,
        height: number= 100,
        theme = themes["default"],
        show_icons: boolean = true,
        border_radius: number = 4.5,
        hide_border: boolean = false

    ) {
        this.width = width;
        this.height = height;
        this.theme = theme;
        this.show_icons = show_icons;
        this.border_radius = border_radius;
        this.hide_border = hide_border;
    }

    protected validateDimentions(width:number,height:number): number[] {

        return [width, height];
    }

    protected abstract renderTitle(): string;
    protected abstract renderBody(): string;

    protected Style(): string {
        return "";
    }

    render(): string {
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

                border: 1px solid rgb(228, 226, 226);
                border-radius: 10px;
            }
            #card-body {
                margin: 20px;
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