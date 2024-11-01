import { Player } from "./player";
import { getThrees } from "./three";
import { getAllTransformations, Transformation } from "./transformations";
import { Winner } from "./winner";

export class GameState{
    private constructor(
        private readonly played: number,
        public readonly currentPlayer: Player
    ){

    }

    private transformPlayed(transformation: Transformation): number{
        let result = 0;
        for(let sourcePosition = 0; sourcePosition < 9; sourcePosition++){
            const targetPosition = transformation.positions[sourcePosition];
            const playerAtSource = this.getPlayerAtPosition(sourcePosition);
            result |= (playerAtSource << (2 * targetPosition))
        }
        return result;
    }

    public *getEquivalentStates(): Iterable<GameState>{
        const playedInEquivalentStates: Set<number> = new Set();
        for(const transformation of getAllTransformations()){
            const transformedPlayed = this.transformPlayed(transformation);
            if(playedInEquivalentStates.has(transformedPlayed)){
                continue;
            }
            playedInEquivalentStates.add(transformedPlayed);
            yield new GameState(transformedPlayed, this.currentPlayer)
        }
    }

    public equals(other: GameState): boolean{
        return other.played === this.played && other.currentPlayer === this.currentPlayer;
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
        return new GameState(newPlayed, nextPlayer);
    }

    public static initial: GameState = new GameState(0, Player.X)
}