import { Theme } from "../../themes/themes.ts";

export interface CardParams {
    width?: number;
    height?: number;
}

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

    public render(): void {
        this.initParams();
    }

    protected initParams(): void {
        this.calcCardDimensions(this.width, this.height);
        this.setBorderRadius(this.border_radius);
    }

    protected calcCardDimensions(width: number | undefined = undefined, height: number | undefined = undefined): void {
        const aspectRatio : number = this.default_width / this.default_height;
        console.log(aspectRatio);

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
        console.log(this.width,this.height);
    }
    protected setBorderRadius(border_radius: number | undefined = undefined): void {
        if(this.border_radius === undefined){
            this.border_radius = this.default_border_radius;
        }
    }
}