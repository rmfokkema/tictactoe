import { GameState } from "../state/game-state";
import { GridCellMeasurements } from "./grid/types";
import { CustomPointerEventTarget } from "../events/types";

export interface PossibilityParent {
    play(
        possibility: Possibility
    ): void
}

export class Possibility {
    
    public constructor(
        private readonly eventTarget: CustomPointerEventTarget,
        parent: PossibilityParent,
        public readonly measurements: GridCellMeasurements,
        public readonly gameState: GameState,
        public readonly position: number
    ){
        eventTarget.addEventListener('pointerdown', ev => {
            ev.allowCancelClick()
        })
        eventTarget.addEventListener('click', () => parent.play(this));
    }

    public destroy(){
        this.eventTarget.destroy();
    }
}