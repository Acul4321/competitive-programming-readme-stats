import { themes } from "../../themes/themes.ts";
export abstract class Card {
    protected width: number;
    protected height: number;
    protected border_radius: number;
    protected theme;
    protected hide_border: boolean;

    constructor(
        width: number = 100,
        height: number= 100,
        border_radius: number = 4.5,
        theme = themes["default"],
        hide_border: boolean = false

    ) {
        this.width = width;
        this.height = height;
        this.border_radius = border_radius;
        this.theme = theme;
        this.hide_border = hide_border;
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
                color: ${this.theme.text_color};
            }
            #card {
                width: ${this.width - 2}px;
                height: ${this.height - 2}px;
                
                display: flex;
                position: relative;
                background-color: ${this.theme.bg_color};

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
              width="${this.width}"
              height="${this.height}"
              viewBox="0 0 ${this.width} ${this.height}"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="descId"
            >

            <foreignObject x="0" y="0" width="100%" height="100%">
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
                    <style id="main-style">${style}</style>
                </body>
            </foreignObject>

            <rect
              data-testid="card-bg"
              x="0.5"
              y="0.5"
              rx="${this.border_radius}"
              height="99%"
              stroke="${this.theme.border_color}"
              width="${this.width - 1}"
              fill="${
                typeof this.theme.bg_color === "object"
                  ? "url(#gradient)"
                  : this.theme.bg_color
              }"
              stroke-opacity="${this.hide_border ? 0 : 1}"
            />
            </svg>
        `;
    }
}