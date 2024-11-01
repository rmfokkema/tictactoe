import '../main.css'
import InfiniteCanvas, { Units } from 'ef-infinite-canvas'
import { getInitialMeasurements } from './measurements';
import { GameState } from './game-state';
import { createTicTacToe } from './content/create-tictactoe';
import { connectClickEvents } from './events/connect-click-events';
import { lightTheme } from './themes';
import { palette } from './palette';

function initialize(): void{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    const infCanvas = new InfiniteCanvas(canvas, {units: Units.CSS, greedyGestureHandling: true})
    const ctx = infCanvas.getContext('2d');

    const tictactoe = createTicTacToe(
        getInitialMeasurements(width, height),
        lightTheme,
        GameState.initial
    )
    let drawRequested = false;
    draw();
    tictactoe.onChange(onChange)

    connectClickEvents(infCanvas, tictactoe);

    function onChange(): void{
        if(drawRequested){
            return;
        }
        requestAnimationFrame(() => {
            draw();
            drawRequested = false;
        })
        drawRequested = true;
    }
    function draw(): void{
        ctx.fillStyle = palette.light;
        ctx.save();
        ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
        ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity);
        tictactoe.draw(ctx);
        ctx.restore();
    }
}

initialize();