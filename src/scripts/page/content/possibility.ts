import type { CustomPointerEventMap } from "../pointer-events/types";
import type { GameState } from "@shared/state/game-state";
import type { Slot } from "../ui";

export interface PossibilityParent {
    play(
        possibility: Possibility
    ): void
}

export class Possibility {
    private readonly clickEventListener: (ev: CustomPointerEventMap['click']) => void;
    public constructor(
        public readonly cell: Slot,
        parent: PossibilityParent,
        public readonly gameState: GameState
    ){
        this.clickEventListener = () => parent.play(this)
        cell.addEventListener('click', this.clickEventListener);
    }

    public destroy(): void {
        this.cell.removeEventListener('click', this.clickEventListener);
    }
}