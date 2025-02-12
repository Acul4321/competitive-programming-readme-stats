import { Theme } from "../../themes/themes.ts";
import { Card } from "./card.ts";

export class ErrorCard extends Card {
    public override readonly default_width: number = 200;
    public override readonly default_height: number = 100;
    public override readonly default_border_radius: number = 10;

    public error: Error;
    public title: string;

    constructor(
        show_icons: boolean,
        hide_border: boolean,
        use_rank_colour: boolean,
        theme: Theme,
        error: Error,
        title: string,
        params?: { width? : number, height? : number, border_radius? : number }
    ) {
        super(show_icons, hide_border, use_rank_colour, theme, params);
        this.error = error;
        this.title = title;

    }

    protected renderTitle(): string {
        return this.title;
    }
    protected renderBody(): string {
        return this.error + '\n' + this.error.stack;
    }
}