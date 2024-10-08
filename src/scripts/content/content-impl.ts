import { Content } from "./content";

export class ContentImpl implements Content{
    public draw(_: CanvasRenderingContext2D): void{}
    public willHandleClick(): boolean {
        return false;
    }

    public onChange(): void {}

    public handleClick(): undefined{}
}