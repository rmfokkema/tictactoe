import { Content } from "./content";
import { Measurements, measurementsInclude } from "./measurements";

export class Cell{
    private onChangeCallback: (() => void) | undefined;

    public constructor(
        private readonly measurements: Measurements,
        private content: Content
    ){

    }

    public willHandleClick(x: number, y: number): boolean{
        if(!measurementsInclude(this.measurements, x, y)){
            return false;
        }
        return this.content.willHandleClick(x, y)
    }

    public onChange(callback: () => void): void{
        this.onChangeCallback = callback;
        this.content.onChange(callback);
    }

    public handleClick(x: number, y: number): void{
        const newContent = this.content.handleClick(x, y);
        if(newContent){
            this.content = newContent;
            this.onChangeCallback?.();
        }
    }

    public draw(ctx: CanvasRenderingContext2D){
        this.content.draw(ctx);
    }
}