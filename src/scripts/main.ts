import '../main.css'
import InfiniteCanvas, { Units } from 'ef-infinite-canvas'
import { getInitialMeasurements } from './measurements';
import { createRenderer } from './renderer/create-renderer';
import { createMap } from './create-map';

function initialize(): void{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    const infCanvas = new InfiniteCanvas(canvas, {units: Units.CSS, greedyGestureHandling: true})
    const initialMeasurements = getInitialMeasurements(width, height);
    console.log('intial measurements', JSON.stringify(initialMeasurements))

    createMap(
        createRenderer(infCanvas.getContext('2d')),
        infCanvas,
        initialMeasurements
    )
}

initialize();