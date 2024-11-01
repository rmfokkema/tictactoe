import { Point } from "../point";
import { Renderable } from "../renderer/types";
import { Theme } from "../themes";
import { Three } from "../three";

export interface Mark extends Renderable{
    getWinStart(three: Three): Point
    getWinEnd(three: Three): Point
    setTheme(theme: Theme): void
}