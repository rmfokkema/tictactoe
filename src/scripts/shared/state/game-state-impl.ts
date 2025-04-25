import { otherPlayer, Player } from "../player";
import { getThrees } from "../three";
import { combine, Identity } from "../transformations";
import type { Winner } from "../winner";
import type { GameStateSummary } from "./game-state-summary";
import { combinedGenerator } from "./combined-generator";
import type { GameState } from "./game-state";
import { PositionBuilder } from "./position-builder";
import { PositionSet } from "./position-set";
import { PositionReader } from "./position-reader";
import type { EquivalentPositions } from "./equivalent-positions";
import { getEquivalentPositions } from "./equivalent-positions-impl";

export class GameStateImpl implements GameState {
    public get id(): number {return this.positionBuilder.positions;}
    private constructor(
        private readonly positionBuilder: PositionBuilder,
        private readonly positionSet: PositionSet,
        private readonly currentPlayer: Player
    ){

    }

    public getEquivalentPositions(): Iterable<EquivalentPositions> {
        return getEquivalentPositions(this.positionBuilder.positions);
    }

    public getPositions(): Generator<number> {
        return PositionReader.readAllPositions(this.positionBuilder.positions);
    }

    public *getNonequivalentSuccessors(): Iterable<GameState> {
        const nextPlayer = otherPlayer(this.currentPlayer);
        for(const nonequivalentEmptyPosition of this.positionSet.getNonequivalentEmptyPositions()){
            yield new GameStateImpl(
                this.positionBuilder.write(nonequivalentEmptyPosition),
                this.positionSet.withPlayerAtPosition(this.currentPlayer, nonequivalentEmptyPosition),
                nextPlayer
            )
        }
    }

    public getCanonical(): GameState {
        const thisPositions = this.getPositions();
        let positionBuilder = PositionBuilder.initial;
        let positionSet = new PositionSet(0);
        let transformation = Identity;
        let player = Player.X;
        for(const thisPosition of thisPositions){
            const transformedThisPosition = transformation.positions[thisPosition];
            const additionalTransformation = positionSet.findTransformationToEquivalent(transformedThisPosition);
            if(!additionalTransformation){
                continue;
            }
            transformation = combine(transformation, additionalTransformation);
            const canonicalPosition = additionalTransformation.positions[transformedThisPosition];
            positionBuilder = positionBuilder.write(canonicalPosition);
            positionSet = positionSet.withPlayerAtPosition(player, canonicalPosition);
            player = otherPlayer(player);
        }
        return new GameStateImpl(positionBuilder, positionSet, player);
    }

    public isPredecessorOf(other: GameState): boolean {
        const thisPositions = this.getPositions();
        const otherPositions = other.getPositions();
        let positionBuilder = PositionBuilder.initial;
        let positionSet = new PositionSet(0);
        let transformation = Identity;
        let player = Player.X;

        for(const [thisPosition, otherPosition] of combinedGenerator(thisPositions, otherPositions)){
            if(thisPosition === undefined){
                break;
            }
            if(otherPosition === undefined){
                return false;
            }

            let equivalentPosition: number = transformation.positions[thisPosition];
            if(otherPosition !== equivalentPosition){
                const additionalTransformation = positionSet.findTransformation(equivalentPosition, otherPosition);
                if(!additionalTransformation){
                    return false;
                }
                transformation = combine(transformation, additionalTransformation);
                equivalentPosition = otherPosition;
            }
            positionBuilder = positionBuilder.write(equivalentPosition);
            positionSet = positionSet.withPlayerAtPosition(player, equivalentPosition);
            player = otherPlayer(player);
        }
        return true;
    }

    public getEquivalentWithSameLineage(predecessor: GameState): GameState | undefined {
        const thisPositions = this.getPositions();
        const predecessorPositions = predecessor.getPositions();
        let positionBuilder = PositionBuilder.initial;
        let positionSet = new PositionSet(0);
        let transformation = Identity;
        let player = Player.X;
        for(const [thisPosition, predecessorPosition] of combinedGenerator(thisPositions, predecessorPositions)){
            if(thisPosition === undefined){
                break;
            }
            let equivalentPosition: number = transformation.positions[thisPosition];
            if(predecessorPosition !== undefined && predecessorPosition !== equivalentPosition){
                const additionalTransformation = positionSet.findTransformation(equivalentPosition, predecessorPosition);
                if(!additionalTransformation){
                    return undefined;
                }
                transformation = combine(transformation, additionalTransformation);
                equivalentPosition = predecessorPosition;
            }
            positionBuilder = positionBuilder.write(equivalentPosition);
            positionSet = positionSet.withPlayerAtPosition(player, equivalentPosition);
            player = otherPlayer(player);
        }
        return new GameStateImpl(positionBuilder, positionSet, player);
    }

    public getLastPlayedPosition(): number | undefined {
        return this.positionBuilder.lastPlayedPosition;
    }

    public equals(other: GameState): boolean {
        return this.id === other.id;
    }

    public findWinner(): Winner | undefined{
        const playersAtPositions = [...this.getPlayersAtPositions()];
        for(const three of getThrees()){
            const playerAtFirstPosition = playersAtPositions[three.positions[0]];
            if(playerAtFirstPosition === 0){
                continue;
            }
            const playerAtSecondPosition = playersAtPositions[three.positions[1]];
            if(playerAtSecondPosition !== playerAtFirstPosition){
                continue;
            }
            const playerAtThirdPosition = playersAtPositions[three.positions[2]];
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

    public getPlayersAtPositions(): Iterable<Player | 0> {
        return this.positionSet.getPlayersAtPositions();
    }

    public playPosition(position: number) {
        const newPositionBuilder = this.positionBuilder.write(position);
        if(newPositionBuilder === this.positionBuilder){
            return this;
        }
        return new GameStateImpl(
            newPositionBuilder,
            this.positionSet.withPlayerAtPosition(this.currentPlayer, position),
            otherPlayer(this.currentPlayer)
        )
    }

    public getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    public toJSON(): number[] {
        return [...this.getPositions()]
    }

    public getSummary(): GameStateSummary {
        return {positions: this.positionBuilder.positions};
    }

    public static fromSummary(cloned: GameStateSummary): GameStateImpl{
        let positionBuilder = PositionBuilder.initial;
        let positionSet = new PositionSet(0);
        let player = Player.X;
        for(const position of PositionReader.readAllPositions(cloned.positions)){
            positionSet = positionSet.withPlayerAtPosition(player, position);
            positionBuilder = positionBuilder.write(position);
            player = otherPlayer(player);
        }
        return new GameStateImpl(positionBuilder, positionSet, player);
    }

    public static initial: GameStateImpl = new GameStateImpl(
        PositionBuilder.initial,
        new PositionSet(0),
        Player.X
    )
}