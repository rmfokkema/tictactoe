import '../../main.css'
import InfiniteCanvas, { Units } from 'ef-infinite-canvas'
import { createRenderer } from './renderer/create-renderer';
import { LocalStorageMapPersister } from './store/local-storage-map-persister';
import { createTicTacToeMap } from './content/map';
import { createInitialThemeSwitchState } from './themes/create-theme-switch';
import { createDarkThemePreferenceTracker } from './themes/create-dark-theme-preference-tracker';
import { LocalStorageThemePreferencePersister } from './themes/local-storage-theme-preference-persister';
import { createPointerEvents } from './pointer-events/create-pointer-events';
import { createRenderableMap } from './ui-impl/create-renderable-map';
import { createSharedWorkClient } from './shared-work/create-shared-work-client';
import { createSelection } from './selection/create-selection';
import { createUrlSelection } from './selection/url-selection';
import fontFaceUrl from '../../FaxSansBeta.otf';

async function initialize(): Promise<void>{
    const fontFace = new FontFace('FaxSans', `url("${fontFaceUrl}") format("opentype")`);
    await fontFace.load();
    document.fonts.add(fontFace)
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    const infCanvas = new InfiniteCanvas(canvas, {units: Units.CSS, greedyGestureHandling: true});
    const channel = new BroadcastChannel('tictactoemap');
    const selection = createSelection();
    const urlSelection = createUrlSelection();
    const map = createTicTacToeMap(
        new LocalStorageMapPersister(),
        channel,
        createSharedWorkClient()
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
    selection.useSelector(renderableMap.selector);
    selection.useSelector(urlSelection);
    map.addStateRenderer(selection);
    renderer.setRenderable(renderableMap);
    const themeSwitch = initialThemeSwitchState.getThemeSwitch(renderableMap.themeAreaTracker);
    themeSwitch.addEventListener('change', () => renderableMap.switchTheme(themeSwitch));
    renderer.rerender();
    await map.load();
    urlSelection.load();
}

initialize();