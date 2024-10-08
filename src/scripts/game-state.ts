import { Player } from "./player";
import { getThrees } from "./three";
import { Winner } from "./winner";

export class GameState{
    private constructor(
        private readonly played: number,
        public readonly lastPlayedPosition: number | undefined,
        public readonly currentPlayer: Player
    ){

    }

    public findWinner(): Winner | undefined{
        for(const three of getThrees()){
            const playerAtFirstPosition = this.getPlayerAtPosition(three.positions[0]);
            if(playerAtFirstPosition === 0){
                continue;
            }
            const playerAtSecondPosition = this.getPlayerAtPosition(three.positions[1]);
            if(playerAtSecondPosition !== playerAtFirstPosition){
                continue;
            }
            const playerAtThirdPosition = this.getPlayerAtPosition(three.positions[2]);
            if(playerAtThirdPosition !== playerAtFirstPosition){
                continue;
            }
            return {
                three,
                player: playerAtFirstPosition
            }
        }
        return undefined;
    }

    public getPlayerAtPosition(position: number): Player | 0 {
        return  (this.played >> (2 * position)) & 3;
    }

    public playPosition(position: number): GameState{
        const newPlayed = this.played | ((this.currentPlayer) << (2 * position));
        const nextPlayer = (this.currentPlayer % 2) + 1;
        return new GameState(newPlayed, position, nextPlayer);
    }

    public static initial: GameState = new GameState(0, undefined, Player.X)
}