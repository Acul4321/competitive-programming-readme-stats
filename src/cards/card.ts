import { Theme } from "../../themes/themes.ts";

// used for cards optional parameters
interface CardParams {
    border_radius?: number;
    width?: number;
    height?: number;
}

export abstract class Card {
    public default_width : number = 200;
    public default_height : number = 100;
    public default_border_radius: number = 4.5;

    public width?: number;
    public height?: number;
    public border_radius: number;
    public show_icons: boolean;
    public hide_border: boolean;
    public use_rank_colour: boolean;
    public theme: Theme;

    constructor(
        params: CardParams = {width: undefined, height: undefined, border_radius: undefined},
        show_icons: boolean,
        hide_border: boolean,
        use_rank_colour: boolean,
        theme: Theme
    ) {
        this.show_icons = show_icons;
        this.hide_border = hide_border;
        this.use_rank_colour = use_rank_colour;
        this.theme = theme;

        this.border_radius = params.border_radius !== undefined ?  params.border_radius : this.default_border_radius;
        
        this.calcCardDimensions(params.width, params.height);
    }

    // calculates the correct dimentions of the card
    protected calcCardDimensions(width?: number, height?: number): void {
        const aspectRatio = this.default_width / this.default_height;

        if (width && !height) {
            this.width = width;
            this.height = width / aspectRatio;
        } else if (height && !width) {
            this.height = height;
            this.width = height * aspectRatio;
        } else if (width && height) {
            this.width = width;
            this.height = height;
        }
    }
}
