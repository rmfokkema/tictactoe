import '../main.css'
import InfiniteCanvas, { Units } from 'ef-infinite-canvas'
import { TicTacToe } from './tictactoe';
import { getInitialMeasurements } from './measurements';

function initialize(): void{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    const infCanvas = new InfiniteCanvas(canvas, {greedyGestureHandling: true, units: Units.CSS})
    const ctx = infCanvas.getContext('2d');

    const tictactoe = TicTacToe.createContent(getInitialMeasurements(width, height), 0, 0)
    draw();
    tictactoe.onChange(() => {
        requestAnimationFrame(draw)

    })
    infCanvas.addEventListener('click', ({offsetX, offsetY}) => {
        if(tictactoe.willHandleClick(offsetX, offsetY)){
            return tictactoe.handleClick(offsetX, offsetY)
        }
        console.log('click is not handled by tictactoe')
    })

    function draw(): void{
        ctx.strokeStyle = '#333'
        ctx.save();
        ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
        tictactoe.draw(ctx);
        ctx.restore();
    }
}

initialize();