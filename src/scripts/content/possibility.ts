import { Content } from "./content";
import { GameState } from "../game-state";
import { Measurements } from "../measurements";
import { TicTacToeFactory } from "./tictactoe-factory";

export class Possibility implements Content{
    private onChangeCallback: (() => void) | undefined;
    public constructor(
        private readonly measurements: Measurements,
        private readonly gameState: GameState,
        private readonly position: number,
        private readonly createTicTacToe: TicTacToeFactory
    ){

    }

    public onChange(callback: () => void): void {
        this.onChangeCallback = callback;
    }

    public draw(): void{

    }

    public willHandleClick(): boolean {
        return true;
    }

    public handleClick(): Content {
        const newContent = this.createTicTacToe(this.measurements, this.gameState.playPosition(this.position));
        if(this.onChangeCallback){
            newContent.onChange(this.onChangeCallback)
        }
        return newContent;
    }
}