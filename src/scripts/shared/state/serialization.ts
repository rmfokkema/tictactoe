import { otherPlayer, Player } from "../player"
import { combine, Identity, type Transformation } from "../transformations"
import type { GameState } from "./game-state"
import type { GameStateTree } from "./game-state-tree"
import { PositionSet } from "./position-set"

export interface SerializedTree {
    [position: number]: SerializedTree
    w?: Player
}

export interface DeserializationHooks {
    addState(newState: GameState): void
    addWinner(winnerState: GameState, winner: Player): void
}

interface DeserializationContext extends DeserializationHooks {
    state: GameState
    transformation: Transformation
    positionSet: PositionSet,
    player: Player,
}

class RootSafeDeserializationContext implements DeserializationContext{
    public state: GameState
    public transformation: Transformation = Identity;
    public positionSet = new PositionSet(0);
    public player = Player.X;
    public constructor(
        public tree: GameStateTree
    ){
        this.state = tree.state
    }

    public addState(newState: GameState): void {
        this.tree = this.tree.addState(newState);
    }

    public addWinner(winnerState: GameState): void{
        this.tree = this.tree.findWinnerFor(winnerState);
    }
}

class RootDeserializationContext implements DeserializationContext {
    public state: GameState
    public transformation: Transformation = Identity;
    public positionSet = new PositionSet(0);
    public player = Player.X;
    public constructor(
        public tree: GameStateTree
    ){
        this.state = tree.state
    }

    public addState(newState: GameState): void {
        this.tree = this.tree.addState(newState);
    }

    public addWinner(winnerState: GameState, winner: Player): void {
        this.tree = this.tree.addWinner(winnerState, winner);
    }
}

export function serializeTree(tree: GameStateTree): SerializedTree {
    const result: SerializedTree = {};
    for(const [_, child] of tree.children){
        const lastPlayedPosition = child.state.getLastPlayedPosition();
        if(lastPlayedPosition === undefined){
            continue;
        }
        result[lastPlayedPosition] = serializeTree(child);
    }
    if(tree.winner){
        result.w = tree.winner;
    }
    return result;
}

function deserializeChildTree(serialized: SerializedTree, context: DeserializationContext): void {
    let revealed = false;
    for(const key of Object.getOwnPropertyNames(serialized)){
        if(/^\d$/.test(key)){
            const position = parseInt(key);
            if(position > 8){
                continue;
            }
            const transformedPosition = context.transformation.positions[position];
            const equivalent = context.positionSet.findEquivalentEmptyPosition(transformedPosition);
            if(!equivalent){
                continue;
            }
            deserializeChildTree(serialized[position], {
                player: otherPlayer(context.player),
                positionSet: context.positionSet.withPlayerAtPosition(context.player, equivalent.position),
                transformation: combine(equivalent.transformation, context.transformation),
                state: context.state.playPosition(equivalent.position),
                addState(state: GameState){
                    context.addState(state)
                },
                addWinner(winnerState: GameState, winner: Player){
                    context.addWinner(winnerState, winner)
                }
            })
        }
    }
    if(!revealed){
        context.addState(context.state);
    }
    const winner = serialized.w;
    if(winner === Player.X || winner === Player.O){
        context.addWinner(context.state, winner);
    }
}

export function deserializeTree(emptyTree: GameStateTree, serialized: SerializedTree): GameStateTree {
    const rootContext = new RootDeserializationContext(emptyTree);
    deserializeChildTree(serialized, rootContext);
    return rootContext.tree;
}

export function safeDeserializeTree(emptyTree: GameStateTree, serialized: SerializedTree): GameStateTree {
    const rootContext = new RootSafeDeserializationContext(emptyTree);
    deserializeChildTree(serialized, rootContext);
    return rootContext.tree;
}