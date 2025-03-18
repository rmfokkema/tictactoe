import '../../main.css'
import InfiniteCanvas, { Units } from 'ef-infinite-canvas'
import { createRenderer } from './renderer/create-renderer';
import { LocalStorageMapPersister } from './store/local-storage-map-persister';
import { createTicTacToeMap } from './content/map';
import { createInitialThemeSwitchState } from './themes/create-theme-switch';
import { createDarkThemePreferenceTracker } from './themes/create-dark-theme-preference-tracker';
import { LocalStorageThemePreferencePersister } from './themes/local-storage-theme-preference-persister';
import { createRequestClient } from './sharedworker/create-request-client';
import { createPointerEvents } from './pointer-events/create-pointer-events';
import { createRenderableMap } from './ui-impl/create-renderable-map';

function initialize(): void{
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    const infCanvas = new InfiniteCanvas(canvas, {units: Units.CSS, greedyGestureHandling: true});
    const channel = new BroadcastChannel('tictactoemap');
    const map = createTicTacToeMap(
        new LocalStorageMapPersister(),
        channel,
        createRequestClient()
    );
    const renderer = createRenderer(infCanvas.getContext('2d'));
    const initialThemeSwitchState = createInitialThemeSwitchState(
        new LocalStorageThemePreferencePersister(),
        createDarkThemePreferenceTracker(),
        channel
    )
    const renderableMap = createRenderableMap(
        map,
        {width, height},
        infCanvas,
        createPointerEvents(infCanvas),
        renderer,
        initialThemeSwitchState
    )

    renderer.setRenderable(renderableMap);
    const themeSwitch = initialThemeSwitchState.getThemeSwitch(renderableMap.themeAreaTracker);
    themeSwitch.addEventListener('change', () => renderableMap.switchTheme(themeSwitch))
    renderer.rerender();
    map.load();
}

initialize();