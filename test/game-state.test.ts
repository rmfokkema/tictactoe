import { describe, it, expect } from 'vitest'
import { GameState } from '../src/scripts/state/game-state'
import { Player } from '../src/scripts/player';
import { MAIN_DIAGONAL } from '../src/scripts/three';
import { Identity, RotateLeft, TurnUpsideDown, RotateRight, FlipHorizontal, FlipOtherDiagonal, FlipVertical, FlipMainDiagonal, Transformation } from '../src/scripts/transformations';

describe('a game state', () => {

    it('should have a current player', () => {
        let state = GameState.initial;

        expect(state.getCurrentPlayer()).toBe(Player.X)

        state = state.playPosition(1);

        expect(state.getCurrentPlayer()).toBe(Player.O)
    })

    it('should return player at position', () => {
        const state = GameState.initial.playPosition(0).playPosition(1);

        const playersAtPositions = [...state.getPlayersAtPositions()];
        expect(playersAtPositions[0]).toBe(Player.X);
        expect(playersAtPositions[1]).toBe(Player.O);
        expect(playersAtPositions[2]).toBe(0)
    })

    it('should have successors', () => {
        const state = GameState.initial
            .playPosition(0)
            .playPosition(1)
            .playPosition(3)
            .playPosition(6)
            .playPosition(4)
        
        const successors = [...state.getSuccessors()];

        expect(successors).toEqual([
            state.playPosition(2),
            state.playPosition(5),
            state.playPosition(7),
            state.playPosition(8)
        ])
    })

    it('should return index of other state', () => {
        const state1 = GameState.initial.playPosition(0).playPosition(1).playPosition(3);
        const state2 = GameState.initial.playPosition(0).playPosition(1);
        const state3 = GameState.initial.playPosition(0);
        const state4 = GameState.initial.playPosition(0).playPosition(2);

        expect(state1.indexOfPredecessor(state2)).toEqual(2)
        expect(state1.indexOfPredecessor(state3)).toEqual(1)
        expect(state1.indexOfPredecessor(state4)).toEqual(-1)
    })

    it('should return predecessor at index', () => {
        const state = GameState.initial.playPosition(0).playPosition(1).playPosition(3);

        expect(state.predecessorAtIndex(0)).toEqual(GameState.initial)
        expect(state.predecessorAtIndex(1)).toEqual(GameState.initial.playPosition(0))
        expect(state.predecessorAtIndex(2)).toEqual(GameState.initial.playPosition(0).playPosition(1))
        expect(state.predecessorAtIndex(3)).toEqual(GameState.initial.playPosition(0).playPosition(1).playPosition(3))
        expect(state.predecessorAtIndex(4)).toEqual(undefined)
        expect(state.predecessorAtIndex(-1)).toEqual(GameState.initial.playPosition(0).playPosition(1))
        expect(state.predecessorAtIndex(-2)).toEqual(GameState.initial.playPosition(0))
        expect(state.predecessorAtIndex(-3)).toEqual(GameState.initial)
        expect(state.predecessorAtIndex(-4)).toEqual(undefined)
    })

    it('should return players at positions', () => {
        const state = GameState.initial
            .playPosition(0)
            .playPosition(1)
            .playPosition(8)
            .playPosition(4)
            .playPosition(7)
            .playPosition(6)
            .playPosition(2)
            .playPosition(5)
            .playPosition(3)
        
        expect([...state.getPlayersAtPositions()]).toEqual([
            Player.X,
            Player.O,
            Player.X,
            Player.X,
            Player.O,
            Player.O,
            Player.O,
            Player.X,
            Player.X
        ])
    })

    it('should equal', () => {
        const state1 = GameState.initial.playPosition(2).playPosition(6);
        const state2 = GameState.initial.playPosition(2).playPosition(6);
        const state3 = GameState.initial.playPosition(2).playPosition(7);

        expect(state1.equals(state2)).toBe(true)
        expect(state1.equals(state3)).toBe(false)
    })

    it('should not have a winner', () => {
        const state = GameState.initial.playPosition(0).playPosition(4);

        expect(state.findWinner()).toBe(undefined);
    })

    it('should have a winner', () => {
        const state = GameState.initial
            .playPosition(0)
            .playPosition(1)
            .playPosition(3)
            .playPosition(6)
            .playPosition(4)
            .playPosition(5)
            .playPosition(8)
        const winner = state.findWinner();

        expect(winner.player).toBe(Player.X);
        expect(winner.three).toBe(MAIN_DIAGONAL)
    })

    it('should transform partially', () => {
        const state1 = GameState.initial.playPosition(0).playPosition(1);
        const state2 = state1.playPosition(4).playPosition(3)
        
        const state3 = state2.playPosition(2).playPosition(5);
        const state4 = state2.playPosition(6).playPosition(7);

        expect(state3.partialTransform(state2, FlipOtherDiagonal)).toEqual(state4);
        expect(state4.partialTransform(state2, FlipOtherDiagonal)).toEqual(state3);
        expect(state1.partialTransform(state2, FlipOtherDiagonal)).toEqual(state1);
    })

    it.each<[GameState, Transformation | undefined]>([
        [GameState.initial.playPosition(2), RotateRight],
        [GameState.initial.playPosition(8), TurnUpsideDown],
        [GameState.initial.playPosition(6), RotateLeft],
        [GameState.initial.playPosition(0), Identity]
    ])('should return equivalence transformation', (otherState, transformation) => {
        const state = GameState.initial.playPosition(0);

        expect([...otherState.getTransformationsFrom(state)]).toContainEqual(transformation)
        expect(otherState.hasEquivalentPosition(state)).toBe(true)
    })

    it('should not have equivalent position', () => {
        expect(GameState.initial.playPosition(0).hasEquivalentPosition(GameState.initial.playPosition(1))).toBe(false)
    })

    it.each<[GameState, Transformation | undefined]>([
        [GameState.initial.playPosition(0).playPosition(1), Identity],
        [GameState.initial.playPosition(0).playPosition(3), FlipOtherDiagonal],
        [GameState.initial.playPosition(2).playPosition(1), FlipHorizontal],
        [GameState.initial.playPosition(2).playPosition(5), RotateRight],

        [GameState.initial.playPosition(8).playPosition(5), FlipMainDiagonal],
        [GameState.initial.playPosition(8).playPosition(7), TurnUpsideDown],
        [GameState.initial.playPosition(6).playPosition(7), FlipVertical],
        [GameState.initial.playPosition(6).playPosition(3), RotateLeft]
    ])('should return equivalence transformation 2', (otherState, transformation) => {
        const state = GameState.initial.playPosition(0).playPosition(1);

        expect([...otherState.getTransformationsFrom(state)]).toContainEqual(transformation)
        expect(otherState.hasEquivalentPosition(state)).toBe(true)
    })
})