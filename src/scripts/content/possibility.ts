import { GameState } from "../game-state";
import { Measurements, measurementsInclude } from "../measurements";
import { ClickHandlerNode, isAccepted } from "../events/types";

export interface PossibilityParent {
    play(
        possibility: Possibility,
        gameState: GameState
    ): void
}

export class Possibility {
    
    public constructor(
        private readonly clickHandler: ClickHandlerNode,
        parent: PossibilityParent,
        public readonly measurements: Measurements,
        public readonly gameState: GameState,
        public readonly position: number
    ){
        clickHandler.onClick((click) => {
            if(!isAccepted(click)){
                if(measurementsInclude(measurements, click.x, click.y)){
                    click.accept();
                }
            }else{
                if(click.type ===  'cancel'){
                    console.log('click on possibility is cancelled')
                    return;
                }
                parent.play(this, this.gameState);
            }
        })
    }

    public destroy(){
        this.clickHandler.destroy();
    }
}