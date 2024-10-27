import { ContentParent } from "./content";
import { GameState } from "../game-state";
import { Measurements, measurementsInclude } from "../measurements";
import { ContentImpl } from "./content-impl";
import { ClickEventAtTarget, isAccepted } from "../events/types";

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

    protected handleClickOnSelf(click: ClickEventAtTarget): void {
        if(!isAccepted(click)){
            if(measurementsInclude(this.measurements, click.x, click.y)){
                click.accept();
            }
        }else{
            if(click.type ===  'cancel'){
                console.log('click on possibility is cancelled')
                return;
            }
            this.possibilityParent.play(this, this.gameState);
        }
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
}