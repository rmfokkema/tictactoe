import { describe, it, expect } from 'vitest'
import { GameState } from '../src/scripts/state/game-state'
import { addToRevealedPosition, RevealedPosition, splitRevealedPosition } from '../src/scripts/state/revealed-position'
import { Player } from '../src/scripts/player'

describe('revealed position', () => {

    it('should be unchanged if there is no winner', () => {
        const parentRevealedPosition: RevealedPosition = {
            gameState: GameState.initial.playPosition(0),
            winner: undefined
        }

        const revealedPosition: RevealedPosition = {
            gameState: GameState.initial
                .playPosition(0)
                .playPosition(1)
                .playPosition(3)
                .playPosition(6)
                .playPosition(4),
            winner: undefined
        }

        const combined = addToRevealedPosition(revealedPosition, parentRevealedPosition, []);

        expect(combined).toEqual(revealedPosition)
    })

    it('should be unchanged if winner is not child', () => {
        const parentRevealedPosition: RevealedPosition = {
            gameState: GameState.initial.playPosition(0),
            winner: undefined
        }

        const winningState = GameState.initial
            .playPosition(0)
            .playPosition(1)
            .playPosition(3)
            .playPosition(6)
            .playPosition(4);

        const winningRevealedPosition: RevealedPosition = {
            gameState: winningState,
            winner: {
                gameState: winningState,
                player: Player.X
            }
        }

        const combined = addToRevealedPosition(winningRevealedPosition, parentRevealedPosition, []);

        expect(combined).toEqual(winningRevealedPosition)
    })

    it('should be based on winning child', () => {
        const parentState = GameState.initial
            .playPosition(0)
            .playPosition(1)
            .playPosition(3)
            .playPosition(6)
        const parentRevealedPosition: RevealedPosition = {
            gameState: parentState,
            winner: undefined
        }
        const winningState = parentState.playPosition(4);
        const winningRevealedPosition: RevealedPosition = {
            gameState: winningState,
            winner: {
                gameState: winningState,
                player: Player.X
            }
        }

        const combined = addToRevealedPosition(winningRevealedPosition, parentRevealedPosition, []);

        expect(combined).toEqual({
            gameState: winningState,
            winner: {
                gameState: parentState,
                player: Player.X
            }
        })
    })

    it('should be based on equivalent children', () => {
        const parentState = GameState.initial
            .playPosition(0)
            .playPosition(5)
            .playPosition(6)
            .playPosition(3)
            .playPosition(4)
        const parent: RevealedPosition = {
            gameState: parentState,
            winner: undefined
        }

        const winnerState = parentState.playPosition(1);
        const position: RevealedPosition = {
            gameState: winnerState.playPosition(8),
            winner: {
                gameState: winnerState,
                player: Player.X
            }
        }
        const childState1 = parentState.playPosition(2);
        const childState2 = parentState.playPosition(8);
        const childState4 = parentState.playPosition(7);

        const children: RevealedPosition[] = [
            {
                gameState: childState1,
                winner: {
                    gameState: childState1,
                    player: Player.X
                }
            },
            {
                gameState: childState2,
                winner: {
                    gameState: childState2,
                    player: Player.X
                }
            },
            {
                gameState: winnerState,
                winner: {
                    gameState: winnerState,
                    player: Player.X
                }
            },
            {
                gameState: childState4,
                winner: undefined
            }
        ];

        const result = addToRevealedPosition(position, parent, children);

        expect(result).toEqual({
            gameState: position.gameState,
            winner: {
                gameState: parentState,
                player: Player.X
            }
        })
    })

    it('should be based on children equivalent to winner', () => {
        const parentState = GameState.initial
            .playPosition(0)
            .playPosition(5)
            .playPosition(6)
            .playPosition(3)
            .playPosition(4)
        const parent: RevealedPosition = {
            gameState: parentState,
            winner: undefined
        }

        const winnerState = parentState.playPosition(2);
        const position: RevealedPosition = {
            gameState: winnerState.playPosition(8),
            winner: {
                gameState: winnerState,
                player: Player.X
            }
        }

        const childState1 = parentState.playPosition(1);
        const childState2 = parentState.playPosition(7);
        const childState4 = parentState.playPosition(8);

        const children: RevealedPosition[] = [
            {
                gameState: childState1,
                winner: undefined
            },
            {
                gameState: childState2,
                winner: undefined
            },
            {
                gameState: winnerState,
                winner: {
                    gameState: winnerState,
                    player: Player.X
                }
            },
            {
                gameState: childState4,
                winner: undefined
            }
        ];

        const result = addToRevealedPosition(position, parent, children);

        expect(result).toEqual(position)
    })

    it('should be based on winning children', () => {
        const parentState = GameState.initial.playPosition(0).playPosition(1).playPosition(3);
        const parent: RevealedPosition = {
            gameState: parentState,
            winner: undefined
        };
        const winnerState = parentState.playPosition(6);
        const position: RevealedPosition = {
            gameState: winnerState.playPosition(4).playPosition(7).playPosition(5),
            winner: {
                gameState: winnerState,
                player: Player.X
            }
        }
        const childState1 = parentState.playPosition(4);
        const childState2 = parentState.playPosition(2);
        const childState3 = parentState.playPosition(5);
        const childState4 = parentState.playPosition(8);
        const childState5 = parentState.playPosition(7);

        const children: RevealedPosition[] = [
            {
                gameState: childState1,
                winner: {
                    gameState: childState1,
                    player: Player.X
                }
            },
            {
                gameState: childState2,
                winner: {
                    gameState: childState2,
                    player: Player.X
                }
            },
            {
                gameState: childState3,
                winner: {
                    gameState: childState3,
                    player: Player.X
                }
            },
            {
                gameState: childState4,
                winner: {
                    gameState: childState4,
                    player: Player.X
                }
            },
            {
                gameState: childState5,
                winner: {
                    gameState: childState5,
                    player: Player.X
                }
            },
            {
                gameState: winnerState,
                winner: undefined
            }
        ];

        const result = addToRevealedPosition(position, parent, children);

        expect(result).toEqual({
            gameState: position.gameState,
            winner: {
                gameState: parentState,
                player: Player.X
            }
        })
    })

    it('should not update based on one child', () => {
        const parentState = GameState.initial.playPosition(0).playPosition(1).playPosition(3);
        const parent: RevealedPosition = {
            gameState: parentState,
            winner: undefined
        };
        const winnerState = parentState.playPosition(4);
        const position: RevealedPosition = {
            gameState: winnerState.playPosition(6),
            winner: {
                gameState: winnerState,
                player: Player.X
            }
        }
        const children: RevealedPosition[] = [
            {
                gameState: winnerState,
                winner: {
                    gameState: winnerState,
                    player: Player.X
                }
            }
        ];

        const result = addToRevealedPosition(position, parent, children);

        expect(result).toEqual(position)
    })

    it('should split simple case', () => {
        const result = [...splitRevealedPosition({
            gameState: GameState.initial.playPosition(0),
            winner: undefined
        }, GameState.initial)]

        expect(result.length).toBe(4)
        expect(result).toContainEqual({
            gameState: GameState.initial.playPosition(0),
            winner: undefined
        })
        expect(result).toContainEqual({
            gameState: GameState.initial.playPosition(2),
            winner: undefined
        })
        expect(result).toContainEqual({
            gameState: GameState.initial.playPosition(8),
            winner: undefined
        })
        expect(result).toContainEqual({
            gameState: GameState.initial.playPosition(6),
            winner: undefined
        })
    })

    it('should split', () => {
        const state = GameState.initial
            .playPosition(0)
            .playPosition(1)
            .playPosition(4)
            .playPosition(3)
        
        const state2 = state.playPosition(2).playPosition(5);
        const state3 = state.playPosition(6).playPosition(7);

        const result = [...splitRevealedPosition({
            gameState: state2,
            winner: undefined
        }, state)];

        expect(result.length).toBe(2);
        expect(result).toContainEqual({
            gameState: state2,
            winner: undefined
        })
        expect(result).toContainEqual({
            gameState: state3,
            winner: undefined
        })
    })

    it('should split this', () => {
        const state = GameState.initial.playPosition(0).playPosition(4);

        const state2 = state.playPosition(2);
        const state3 = state.playPosition(6);

        const result = [...splitRevealedPosition({
            gameState: state2,
            winner: undefined
        }, state)];

        expect(result.length).toBe(2);
        expect(result).toContainEqual({
            gameState: state2,
            winner: undefined
        })
        expect(result).toContainEqual({
            gameState: state3,
            winner: undefined
        })
    })

    it('should split with winner', () => {
        const state = GameState.initial
        .playPosition(0)
        .playPosition(1)
        .playPosition(4)
        .playPosition(3)
    
        const state2 = state.playPosition(2);
        const state2Winner = state2.playPosition(5).playPosition(8);
        const state3 = state.playPosition(6);
        const state3Winner = state3.playPosition(7).playPosition(8);

        const result = [...splitRevealedPosition({
            gameState: state2,
            winner: {
                player: Player.X,
                gameState: state2Winner
            }
        }, state)];

        expect(result.length).toBe(2);
        expect(result).toContainEqual({
            gameState: state2,
            winner: {
                player: Player.X,
                gameState: state2Winner
            }
        })
        expect(result).toContainEqual({
            gameState: state3,
            winner: {
                player: Player.X,
                gameState: state3Winner
            }
        })
    })
})