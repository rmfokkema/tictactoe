import type { Point } from "../measurements";
import type { Theme } from "../theme";
import type { Drawing } from "../drawing";
import type { Drawable } from "../drawable";
import type { Themeable } from "../themeable";

export class Win implements Drawable, Themeable{
    public constructor(
        private theme: Theme,
        private readonly start: Point,
        private readonly end: Point,
        private readonly lineWidth: number
    ){

    }

    public setTheme(theme: Theme): void{
        this.theme = theme;
    }

    public draw(drawing: Drawing): void {
        drawing.setLineWidth(this.lineWidth);
        drawing.save();
        drawing.setLineColor(this.theme.color);
        drawing.addLine(this.start.x, this.start.y, this.end.x, this.end.y);
        drawing.restore();
    }
}