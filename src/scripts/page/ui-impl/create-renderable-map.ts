import type { InfiniteCanvas } from "ef-infinite-canvas";
import type { ScreenMeasurements } from "../measurements";
import type { RenderableMap } from "./renderable-map";
import type { Theme, ThemeSwitchProperties } from "../themes";
import type { TicTacToeMap } from "../map/tictactoemap";
import type { Rerenderer } from "../renderer/types";
import type { CustomPointerEventTarget } from "../pointer-events/types";
import { GridImpl } from "./grid-impl";
import { GridImpl as UiGridImpl } from '@shared/drawing/grid'
import { createThemeAreaTracker } from "./create-theme-area-tracker";
import { createAreas, type MapPartMeasurements } from "./areas";
import { createTextArea } from "./create-text-area";
import { createGithubLink } from "./create-github-link";
import type { RenderableMapPart } from "./renderable-map-part";
import { createInfiniteCanvasDrawing } from "./infinite-canvas-drawing";
import { createSelectionIndicator } from "./create-selection-indicator";
import type { RenderedSelection, Selector } from "../selection/selector";
import type { EventTargetLike } from "../events/types";
import type { SelectionEventMap } from "../selection/selection-event-map";
import { EventDispatcher } from "../events/event-dispatcher";

function createPartialSelector(
    selectionIndicator: Selector,
    renderedMap: EventTargetLike<SelectionEventMap>
): RenderedSelection{
    return {
        addEventListener(type, handler) {
            renderedMap.addEventListener(type, handler)
        },
        removeEventListener(type, handler) {
            renderedMap.removeEventListener(type, handler);
        },
        select(state) {
            selectionIndicator.select(state);
        },
        unselect(){
            selectionIndicator.unselect();
        }
    }
}

function createRenderableMapPart(
    map: TicTacToeMap,
    {
        grid: gridMeasurements,
        textArea: textAreaMeasurements,
        githubLink: githubLinkMeasurements
    }: MapPartMeasurements,
    eventTarget: CustomPointerEventTarget,
    rerenderer: Rerenderer,
    theme: Theme
): RenderableMapPart & { selector: RenderedSelection} {
    const uiGrid = UiGridImpl.create(gridMeasurements, theme)
    const grid = GridImpl.create(rerenderer, uiGrid, eventTarget, theme);
    const renderedMap = map.renderOnGrid(grid);
    const selectionIndicator = createSelectionIndicator(uiGrid, rerenderer, theme);
    const textArea = createTextArea(textAreaMeasurements, theme);
    const githubLink = createGithubLink(githubLinkMeasurements, theme, rerenderer, eventTarget);
    return {
        draw(ctx) {
            const drawing = createInfiniteCanvasDrawing(ctx)
            grid.draw(drawing);
            selectionIndicator.draw(ctx);
            textArea.draw(ctx);
            githubLink.draw(ctx);
        },
        setTheme(theme) {
            renderedMap.setTheme(theme);
            selectionIndicator.setTheme(theme);
            textArea.setTheme(theme);
            githubLink.setTheme(theme);
        },
        selector: createPartialSelector(selectionIndicator, renderedMap)
    }
}

function createSelector(
    eventTarget: CustomPointerEventTarget,
    primarySelector: RenderedSelection,
    secondarySelector: RenderedSelection
): RenderedSelection{
    const eventDispatcher: EventDispatcher<SelectionEventMap> = new EventDispatcher({
        stateselected: [],
        unselected: []
    })
    eventTarget.addEventListener('click', () => {
        eventDispatcher.dispatchEvent('unselected', undefined)
    })
    primarySelector.addEventListener('stateselected', s => eventDispatcher.dispatchEvent('stateselected', s))
    secondarySelector.addEventListener('stateselected', s => eventDispatcher.dispatchEvent('stateselected', s))
    return {
        select(state) {
            primarySelector.select(state);
            secondarySelector.select(state);
        },
        unselect() {
            primarySelector.unselect();
            secondarySelector.unselect();
        },
        addEventListener(type, handler) {
            eventDispatcher.addEventListener(type, handler);
        },
        removeEventListener(type, handler) {
            eventDispatcher.removeEventListener(type, handler);
        },
    }
}

export function createRenderableMap(
    map: TicTacToeMap,
    {width, height}: ScreenMeasurements,
    infiniteCanvas: InfiniteCanvas,
    eventTarget: CustomPointerEventTarget,
    rerenderer: Rerenderer,
    themeSwitchProps: ThemeSwitchProperties
): RenderableMap {
    const areas = createAreas({width, height}, themeSwitchProps);
    const { primary: primaryMeasurements, secondary: secondaryMeasurements} = areas.getMeasurements();
    const primary = createRenderableMapPart(
        map,
        primaryMeasurements,
        eventTarget,
        rerenderer,
        themeSwitchProps.primaryTheme
    );
    const secondary = createRenderableMapPart(
        map,
        secondaryMeasurements,
        eventTarget,
        rerenderer,
        themeSwitchProps.secondaryTheme
    )
    areas.setParts({primary, secondary})
    return {
        themeAreaTracker: createThemeAreaTracker(infiniteCanvas, areas),
        draw(ctx){
            ctx.save();
            ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
            areas.draw(ctx);
            ctx.restore();
        },
        switchTheme(props){
            areas.switchTheme(props);
            rerenderer.rerender();
        },
        selector: createSelector(eventTarget, primary.selector, secondary.selector)
    };
}