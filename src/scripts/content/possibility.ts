import { GameState } from "../state/game-state";
import { measurementsInclude } from "../measurements";
import { ClickHandlerNode, isAccepted } from "../events/types";
import { GridCellMeasurements } from "./grid/types";

export interface PossibilityParent {
    play(
        possibility: Possibility
    ): void
}

export class Possibility {
    
    public constructor(
        private readonly clickHandler: ClickHandlerNode,
        parent: PossibilityParent,
        public readonly measurements: GridCellMeasurements,
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
                    return;
                }
                parent.play(this);
            }
        })
    }

    public destroy(){
        this.clickHandler.destroy();
    }
}