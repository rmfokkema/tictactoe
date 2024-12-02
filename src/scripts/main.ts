import '../main.css'
import InfiniteCanvas, { Units } from 'ef-infinite-canvas'
import { getInitialMeasurements } from './measurements';
import { GameState } from './state/game-state';
import { createTicTacToe } from './content/create-tictactoe';
import { lightTheme } from './themes';
import { palette } from './palette';
import { createRenderer } from './renderer/create-renderer';
import { createClickHandler } from './events/create-click-handler';

function initialize(): void{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    const infCanvas = new InfiniteCanvas(canvas, {units: Units.CSS, greedyGestureHandling: true})
    const ctx = infCanvas.getContext('2d');
    const renderer = createRenderer(ctx);
    const clickHandler = createClickHandler(infCanvas);
    const tictactoe = createTicTacToe(
        clickHandler,
        renderer,
        getInitialMeasurements(width, height),
        lightTheme,
        GameState.initial
    )

    renderer.setRenderable({
        draw(ctx): void{
            ctx.fillStyle = palette.light;
            ctx.save();
            ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
            ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity);
            tictactoe.draw(ctx);
            ctx.restore();
        }
    })

    renderer.rerender();
}

initialize();