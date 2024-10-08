import '../main.css'
import InfiniteCanvas, { Units } from 'ef-infinite-canvas'
import { TicTacToe } from './content/tictactoe';
import { getInitialMeasurements } from './measurements';
import { GameState } from './game-state';
import { defaultColor } from './colors';

function initialize(): void{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    const infCanvas = new InfiniteCanvas(canvas, {units: Units.CSS})
    const ctx = infCanvas.getContext('2d');

    const tictactoe = TicTacToe.createContent(
        getInitialMeasurements(width, height),
        GameState.initial)
    draw();
    tictactoe.onChange(() => {
        requestAnimationFrame(draw)

    })

    infCanvas.addEventListener('click', ({offsetX, offsetY}) => {
        if(tictactoe.willHandleClick(offsetX, offsetY)){
            tictactoe.handleClick(offsetX, offsetY);
            return;
        }
        console.log('click is not handled by tictactoe')
    })

    function draw(): void{
        ctx.strokeStyle = defaultColor;
        ctx.save();
        ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
        tictactoe.draw(ctx);
        ctx.restore();
    }
}

initialize();