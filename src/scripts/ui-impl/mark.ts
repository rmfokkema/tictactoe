import { Point } from "../point"
import { Three } from "../three"
import { Drawable } from "../ui/drawable"

export function isMark(content: Drawable): content is Mark {
    return (content as Mark).getWinStart !== undefined;
}
export interface Mark extends Drawable {
    getWinStart(three: Three): Point
    getWinEnd(three: Three): Point
}