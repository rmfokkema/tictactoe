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
        private readonly gameState: GameState,
        private readonly position: number
    ){
        super(parent);
        this.possibilityParent = parent;
    }

    public draw(): void{

    }

    public willHandleClick(x: number, y: number): boolean {
        if(!measurementsInclude(this.measurements, x, y)){
            return false;
        }
        return true;
    }

    public handleClick(): void {
        const newGameState = this.gameState.playPosition(this.position);
        this.possibilityParent.play(this, newGameState);
    }
}