import type { Point } from "../measurements"
import type { Drawable } from "../drawable";
import type { Three } from "../../three"
import type { Themeable } from "../themeable";

export function isMark(content: Drawable): content is Mark {
    return (content as Mark).getWinStart !== undefined;
}
export interface Mark extends Drawable, Themeable {
    getWinStart(three: Three): Point
    getWinEnd(three: Three): Point
}