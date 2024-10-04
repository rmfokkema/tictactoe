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

    const tictactoe = new TicTacToe(ctx, infCanvas, getInitialMeasurements(width, height), 0, 0)
    tictactoe.draw();
    tictactoe.activate();
}

initialize();