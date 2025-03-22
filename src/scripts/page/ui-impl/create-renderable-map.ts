import type { InfiniteCanvas } from "ef-infinite-canvas";
import type { ScreenMeasurements } from "../measurements";
import type { RenderableMap } from "./renderable-map";
import type { Theme, ThemeSwitchProperties } from "../themes";
import type { TicTacToeMap } from "../map/tictactoemap";
import type { Rerenderer } from "../renderer/types";
import type { CustomPointerEventTarget } from "../pointer-events/types";
import { GridImpl } from "./grid-impl";
import { createThemeAreaTracker } from "./create-theme-area-tracker";
import { createAreas, type MapPartMeasurements } from "./areas";
import { createTextArea } from "./create-text-area";
import { createGithubLink } from "./create-github-link";
import type { RenderableMapPart } from "./renderable-map-part";
import { createInfiniteCanvasDrawing } from "./infinite-canvas-drawing";

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
): RenderableMapPart {
    const grid = GridImpl.create(rerenderer, gridMeasurements, eventTarget, theme);
    const renderedMap = map.renderOnGrid(grid);
    const textArea = createTextArea(textAreaMeasurements, theme);
    const githubLink = createGithubLink(githubLinkMeasurements, theme, rerenderer, eventTarget);
    return {
        draw(ctx) {
            const drawing = createInfiniteCanvasDrawing(ctx)
            grid.draw(drawing);
            textArea.draw(ctx);
            githubLink.draw(ctx);
        },
        setTheme(theme) {
            renderedMap.setTheme(theme);
            textArea.setTheme(theme);
            githubLink.setTheme(theme);
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
    return {
        themeAreaTracker: createThemeAreaTracker(infiniteCanvas, areas),
        draw(ctx){
            ctx.save();
            ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
            areas.draw(ctx);
            primary.draw(ctx);
            secondary.draw(ctx);
            ctx.restore();
        },
        switchTheme(props){
            primary.setTheme(props.primaryTheme);
            secondary.setTheme(props.secondaryTheme);
            areas.switchTheme(props);
            rerenderer.rerender();
        }
    };
}