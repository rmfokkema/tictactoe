import { Point } from "../point";
import { Three } from "../three";
import { Content } from "./content";

export interface Mark extends Content{
    getWinStart(three: Three): Point
    getWinEnd(three: Three): Point
}