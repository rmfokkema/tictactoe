import { Player } from "./player";

export class GameState{
    private constructor(
        private readonly played: number,
        public readonly lastPlayedPosition: number | undefined,
        public readonly currentPlayer: Player
    ){

    }

    public getPlayerAtPosition(position: number): Player | 0 {
        return  (this.played >> (2 * position)) & 3;
    }

    public playPosition(position: number): GameState{
        const newPlayed = this.played | ((this.currentPlayer) << (2 * position));
        const nextPlayer = (this.currentPlayer % 2) + 1;
        return new GameState(newPlayed, position, nextPlayer);
    }

    public static initial: GameState = new GameState(0, undefined, Player.Tic)
}