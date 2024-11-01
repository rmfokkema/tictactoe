import { Point } from "../point";
import { Theme } from "../themes";
import { Three } from "../three";
import { Content } from "./content";

export interface Mark extends Content{
    getWinStart(three: Three): Point
    getWinEnd(three: Three): Point
    setTheme(theme: Theme): void
}