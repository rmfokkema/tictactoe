import { Player } from "../player";
import { GameState } from "../state/game-state";
import { RevealedPosition, splitGameState, splitRevealedPosition } from "../state/revealed-position";
import { MapStoreMutations } from "./map-store";

type StorageStateJson = {
    [position: number]: StorageStateJson
    w?: Player
}

export class MapStorageState implements MapStoreMutations {
    private readonly playersAtPositions: (Player | 0)[];
    private constructor(
        private readonly gameState: GameState,
        private readonly positions: (MapStorageState | undefined)[] = [],
        private winner?: Player | undefined
    ){
        this.playersAtPositions = [...gameState.getPlayersAtPositions()];
    }
    public revealPosition(position: RevealedPosition): void {
        const winner = position.winner;
        if(winner && winner.gameState.equals(this.gameState)){
            this.winner = winner.player;
        }
        if(position.gameState.equals(this.gameState)){
            return;
        }
        const split = [...splitRevealedPosition(position, this.gameState)];
        for(let i = 0; i < 9; i++){
            if(this.playersAtPositions[i] !== 0){
                continue;
            }
            const stateAtPosition = this.gameState.playPosition(i);
            const revealedPositionAtPosition = split.find(s => s.gameState.indexOfPredecessor(stateAtPosition) > -1);
            if(!revealedPositionAtPosition){
                continue;
            }
            const storageStateForPosition = this.positions[i] || new MapStorageState(stateAtPosition);
            storageStateForPosition.revealPosition(revealedPositionAtPosition);
            this.positions[i] = storageStateForPosition;
            break;
        }
    }

    public hideState(state: GameState): void{
        const split = [...splitGameState(state, this.gameState)];
        for(let i = 0; i < 9; i++){
            const storageStateForPosition = this.positions[i];
            if(!storageStateForPosition){
                continue;
            }
            const hasSplitGameState = split.some(s => s.state.equals(storageStateForPosition.gameState));
            if(hasSplitGameState){
                this.positions[i] = undefined;
                continue;
            }
            const descendant = split.find(s => s.state.indexOfPredecessor(storageStateForPosition.gameState) > -1);
            if(descendant){
                storageStateForPosition.hideState(descendant.state)
            }
        }
    }

    public *getRevealedPositions(): Iterable<RevealedPosition> {
        let revealed = false;
        let revealedWinner = false;
        for(let i = 0; i < 9; i++){
            const stateAtIndex = this.positions[i];
            if(!stateAtIndex){
                continue;
            }
            for(const {gameState, winner} of stateAtIndex.getRevealedPositions()){
                revealed = true;
                if(winner){
                    yield { gameState, winner }
                    continue;
                }
                if(this.winner !== undefined){
                    revealedWinner = true;
                    yield {
                        gameState,
                        winner: {
                            gameState: this.gameState,
                            player: this.winner
                        }
                    }
                    continue;
                }
                yield { gameState, winner }
            }
        }
        if(this.winner !== undefined && !revealedWinner){
            yield {
                gameState: this.gameState,
                winner: {
                    gameState: this.gameState,
                    player: this.winner
                }
            }
            return;
        }
        if(!revealed && !this.gameState.equals(GameState.initial)){
            yield {
                gameState: this.gameState,
                winner: undefined
            }
        }
    }

    public toJSON(){
        const result: {
            [index: number]: MapStorageState,
            w?: Player
        } = {};
        for(let i = 0; i < 9; i++){
            const stateAtIndex = this.positions[i];
            if(stateAtIndex){
                result[i] = stateAtIndex;
            }
        }
        if(this.winner){
            result.w = this.winner;
        }
        return result;
    }

    public static fromJSON(json: StorageStateJson, gameState?: GameState): MapStorageState {
        const state = gameState || GameState.initial;
        const winner = json.w;
        const positions: MapStorageState[] = [];
        for(let i = 0; i < 9; i++){
            const jsonAtIndex = json[i];
            if(!jsonAtIndex){
                continue;
            }
            const gameStateAtIndex = state.playPosition(i);
            positions[i] = this.fromJSON(jsonAtIndex, gameStateAtIndex);
        }
        return new MapStorageState(state, positions, winner);
    }

    public static create(): MapStorageState {
        return new MapStorageState(GameState.initial);
    }
}
