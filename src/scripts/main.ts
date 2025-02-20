import '../main.css'
import InfiniteCanvas, { Units } from 'ef-infinite-canvas'
import { createRenderer } from './renderer/create-renderer';
import { renderMap } from './render-map';
import { LocalStorageMapPersister } from './store/local-storage-map-persister';
import { createTicTacToeMap } from './content/map';

function initialize(): void{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    const infCanvas = new InfiniteCanvas(canvas, {units: Units.CSS, greedyGestureHandling: true});
    const renderer = createRenderer(infCanvas.getContext('2d'));
    const channel = new BroadcastChannel('tictactoemap');
    const map = createTicTacToeMap(new LocalStorageMapPersister(), channel);
    
    renderMap(
        renderer,
        infCanvas,
        { width, height },
        map
    )
    map.load();
}

initialize();