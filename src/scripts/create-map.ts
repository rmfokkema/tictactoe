import { createTicTacToe } from "./content/create-tictactoe";
import { createClickHandler } from "./events/create-click-handler";
import { PointerEventTargetLike } from "./events/types";
import { getInitialMeasurements, Measurements, ScreenMeasurements } from "./measurements";
import { palette } from "./palette";
import { Renderer } from "./renderer/types";
import { GameState } from "./state/game-state";
import { lightTheme } from "./themes";

export function createMap(
    renderer: Renderer,
    pointerEvents: PointerEventTargetLike,
    screenMeasurements: ScreenMeasurements
): void {
    const clickHandler = createClickHandler(pointerEvents);
    const measurements = getInitialMeasurements(screenMeasurements.width, screenMeasurements.height);
    const tictactoe = createTicTacToe(
        clickHandler,
        renderer,
        measurements,
        lightTheme,
        GameState.initial
    )

    renderer.setRenderable({
        draw(ctx): void{
            ctx.fillStyle = palette.light;
            ctx.save();
            ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
            ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity);
            tictactoe.draw(ctx);
            ctx.restore();
        }
    })

    renderer.rerender();
}