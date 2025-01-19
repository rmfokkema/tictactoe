import { describe, beforeEach, it, expect } from 'vitest'
import { createTicTacToeRoot, TicTacToeRoot } from '../src/scripts/content/tictactoe-root'
import { MockTheme } from './mock-theme';
import { RevealedPosition } from '../src/scripts/state/revealed-position';
import { Player } from '../src/scripts/player';
import { createTestPlayer } from './player/test-player-impl';
import { TestPlayer } from './player/test-player';
import { GameState } from '../src/scripts/state/game-state';

describe('a tictactoe', () => {
    let ticTacToe: TicTacToeRoot;
    let player: TestPlayer;
    
    beforeEach(() => {
        player = createTestPlayer();
        ticTacToe = createTicTacToeRoot(
            player.grid,
            new MockTheme()
        )
    })

    describe('when playing 0, 1, 3, 6, 4 and 5', () => {
        let player2: TestPlayer;

        beforeEach(() => {
            player2 = player
                .play(0)
                .play(1)
                .play(3)
                .play(6)
                .play(4)
                .play(5)
        });

        it('should show winner and loser', () => {
            player2.play(8);
            const grid013645 = player2.grid;
            expect(grid013645.toString()).toMatchSnapshot();
        })

        it('should reveal winner', () => {
            let revealedPosition: RevealedPosition;
            ticTacToe.addEventListener('positionrevealed', p => revealedPosition = p);
            player2.play(8);
            expect(revealedPosition).toEqual({
                gameState: player2.gameState.playPosition(8),
                winner: {
                    player: Player.X,
                    gameState: player2.gameState
                }
            })
        })


    })

    describe('when playing 0, 5, 2, 1, 4 and 3', () => {
        let player2: TestPlayer;

        beforeEach(() => {
            player2 = player
                .play(0)
                .play(5)
                .play(2)
                .play(1)
                .play(4)
                .play(3)
        });

        it('should reveal and display two winners when playing 8', () => {
            let revealedPosition: RevealedPosition;
            ticTacToe.addEventListener('positionrevealed', p => revealedPosition = p);
            player2.play(8);
            expect(player2.grid.toString()).toMatchSnapshot();
            expect(revealedPosition).toEqual({
                gameState: player2.gameState.playPosition(8),
                winner: {
                    player: Player.X,
                    gameState: player2.gameState
                }
            })
        })

        it('should reveal and display two winners when playing 6', () => {
            let revealedPosition: RevealedPosition;
            ticTacToe.addEventListener('positionrevealed', p => revealedPosition = p);
            player2.play(6);
            expect(player2.grid.toString()).toMatchSnapshot();
            expect(revealedPosition).toEqual({
                gameState: player2.gameState.playPosition(6),
                winner: {
                    player: Player.X,
                    gameState: player2.gameState
                }
            })
        })
    })

    describe('when playing 0, 1, 3, 6 and 4', () => {
        let player01: TestPlayer;
        let player013: TestPlayer;
        let player0136: TestPlayer;
        let player01364: TestPlayer;
        let player013647: TestPlayer;

        beforeEach(() => {
            player01 = player
                .play(0)
                .play(1);
            player013 = player01.play(3);
            player0136 = player013.play(6);
            player01364 = player0136.play(4)
            player01364.play(5).play(8);
            player01364.play(2).play(5);
            player01364.play(8).play(5);
            player013647 = player01364.play(7);
        })

        it('should show winner higher up', () => {
            let revealedPosition: RevealedPosition;
            ticTacToe.addEventListener('positionrevealed', p => revealedPosition = p);
            player013647.play(8);
            expect(revealedPosition).toEqual({
                gameState: player013647.gameState.playPosition(8),
                winner: {
                    gameState: player0136.gameState,
                    player: Player.X
                }
            })
            expect(player0136.grid.toString()).toMatchSnapshot();
        })

        describe('and 7 and 8', () => {
            let player0138: TestPlayer;

            beforeEach(() => {
                player013647.play(8);
                player013.play(4).play(6);
                player013.play(7).play(6);
                player013.play(2).play(6);
                player013.play(5).play(6);
                player0138 = player013.play(8)
            })

            it('should show winner even higher up', () => {
                let revealedPosition: RevealedPosition;
                ticTacToe.addEventListener('positionrevealed', p => revealedPosition = p);
                player0138.play(6);
                expect(revealedPosition).toEqual({
                    gameState: player0138.gameState.playPosition(6),
                    winner: {
                        gameState: player01.gameState,
                        player: Player.X
                    }
                })
                expect(player01.grid.toString()).toMatchSnapshot();
            })

            describe('and winner 01 is revealed', () => {

                beforeEach(() => {
                    player0138.play(6);
                })

                it('should delete states by double clicking', () => {
                    let hiddenState: GameState;
                    ticTacToe.addEventListener('statehidden', s => hiddenState = s);
                    player013.grid.findByPosition([0]).dblclick();
                    expect(hiddenState).toEqual(player013.gameState)
                    expect(player.grid.toString()).toMatchSnapshot();
                })
            })
        })
    })

    it.skip('should reveal position', () => {
        const state0138 = GameState.initial
            .playPosition(0)
            .playPosition(1)
            .playPosition(3)
            .playPosition(8)
        const state01386 = state0138.playPosition(6);
        ticTacToe.revealPosition({
            gameState: state01386,
            winner: {
                gameState: state0138,
                player: Player.X
            }
        });
        const grid8750 = player.grid.findByPosition([8]).grid;
        console.log(grid8750.toString())
    })
})