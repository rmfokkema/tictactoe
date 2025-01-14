import { GameState } from "./game-state";
import { otherPlayer, Player } from "../player";
import { Transformation } from "../transformations";

export interface RevealedWinner {
    player: Player
    gameState: GameState
}

export interface RevealedPosition{
    gameState: GameState
    winner: RevealedWinner | undefined
}

function partialTransformRevealedPosition(
    position: RevealedPosition,
    fromState: GameState,
    transformation: Transformation): RevealedPosition{
        return {
            gameState: position.gameState.partialTransform(fromState, transformation),
            winner: position.winner ? {
                gameState: position.winner.gameState.partialTransform(fromState, transformation),
                player: position.winner.player
            } : undefined
        }
}

function findSplitTransformation(fromState: GameState, nextOne: GameState, candidate: GameState): Transformation | undefined{
    const fromStatePositionSet = fromState.getPositionSet();
    for(const transformation of candidate.getTransformationsFrom(nextOne)){
        if(!fromStatePositionSet.transform(transformation).equals(fromStatePositionSet)){
            continue;
        }
        return transformation;
    }
    return undefined;
}

export function *splitGameState(state: GameState, fromState: GameState): Iterable<{state: GameState, transformation: Transformation}> {
    const indexOfState = state.indexOfPredecessor(fromState);
    if(indexOfState === -1){
        return;
    }
    const nextOne = state.predecessorAtIndex(indexOfState + 1);
    if(!nextOne){
        return;
    }
    for(const successor of fromState.getSuccessors()){
        const transformation = findSplitTransformation(fromState, nextOne, successor);
        if(!transformation){
            continue;
        }
        yield {
            state: state.partialTransform(fromState, transformation),
            transformation
        }
    }
}

export function *splitRevealedPosition(position: RevealedPosition, fromState: GameState): Iterable<RevealedPosition>{
    for(const {state, transformation} of splitGameState(position.gameState, fromState)){
        yield {
            gameState: state,
            winner: position.winner ? {
                gameState: position.winner.gameState.partialTransform(fromState, transformation),
                player: position.winner.player
            } : undefined
        }
    }
}

function stringifyRevealedWinner(winner: RevealedWinner): string{
    return `winner ${winner.player} at ${winner.gameState}`
}

function stringifyRevealedPosition(position: RevealedPosition): string{
    return `position ${position.gameState}${position.winner ? ` (${stringifyRevealedWinner(position.winner)})` : ''}`
}

function updateWinner(
    winner: RevealedWinner,
    parent: RevealedPosition,
    children: RevealedPosition[]
): RevealedWinner{
    const winnerIsInChild = winner.gameState.predecessorAtIndex(-1)?.equals(parent.gameState);
    if(!winnerIsInChild){
        return winner;
    }
    const currentPlayer = parent.gameState.getCurrentPlayer();
    if(winner.player === currentPlayer){
        return {
            gameState: parent.gameState,
            player: winner.player
        }
    }
    const other = otherPlayer(currentPlayer);
    for(const child of children){
        if(child.winner){
            if(child.winner.player !== other){
                return winner;
            }
            continue;
        }
        const childIsEquivalentToWinner = child.gameState.hasEquivalentPosition(winner.gameState);
        if(!childIsEquivalentToWinner){
            return winner;
        }
    }
    for(const successor of parent.gameState.getSuccessors()){
        const hasEquivalendChild = children.some(c => c.gameState.hasEquivalentPosition(successor))
        if(!hasEquivalendChild){
            return winner;
        }
    }
    return {
        gameState: parent.gameState,
        player: winner.player
    }
}

export function addToRevealedPosition(
    position: RevealedPosition,
    parent: RevealedPosition,
    children: RevealedPosition[]): RevealedPosition{
        if(!position.winner || parent.winner){
            return position;
        }
        return {
            gameState: position.gameState,
            winner: updateWinner(position.winner, parent, children)
        }
}