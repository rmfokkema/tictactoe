import { Content } from "./content";
import { Measurements } from "./measurements";
import { TicTacToeFactory } from "./tictactoe-factory";

export class Possibility implements Content{
    private onChangeCallback: (() => void) | undefined;
    public constructor(
        private readonly measurements: Measurements,
        private readonly gameState: number,
        private readonly currentPlayer: number,
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
        const newGameState = this.gameState | ((1 + this.currentPlayer) << (2 * this.position))
        const nextPlayer = (this.currentPlayer + 1) % 2;
        const newContent = this.createTicTacToe(this.measurements, newGameState, nextPlayer);
        if(this.onChangeCallback){
            newContent.onChange(this.onChangeCallback)
        }
        return newContent;
    }
}