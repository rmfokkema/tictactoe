import { ContentParent } from "./content";
import { GameState } from "../game-state";
import { Measurements, measurementsInclude } from "../measurements";
import { ContentImpl } from "./content-impl";

export interface PossibilityParent extends ContentParent{
    play(
        possibility: Possibility,
        gameState: GameState
    ): void
}

export class Possibility extends ContentImpl{
    private readonly possibilityParent: PossibilityParent
    
    public constructor(
        parent: PossibilityParent,
        public readonly measurements: Measurements,
        public readonly gameState: GameState,
        public readonly position: number,
        public readonly isLosing: boolean
    ){
        super(parent);
        this.possibilityParent = parent;
    }

    public draw(ctx: CanvasRenderingContext2D): void{
        if(!this.isLosing){
            return;
        }
        const {x, y, size} = this.measurements;
        ctx.save();
        ctx.lineWidth = size / 100;
        ctx.beginPath();
        ctx.moveTo(x, y)
        ctx.lineTo(x + size, y + size);
        ctx.moveTo(x, y + size)
        ctx.lineTo(x + size, y)
        ctx.stroke()
        ctx.restore();
    }

    public willHandleClick(x: number, y: number): boolean {
        if(!measurementsInclude(this.measurements, x, y)){
            return false;
        }
        return true;
    }

    public handleClick(): void {
        this.possibilityParent.play(this, this.gameState);
    }
}