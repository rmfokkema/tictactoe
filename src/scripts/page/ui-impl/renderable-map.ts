import type { Renderable } from "../renderer/types";
import type { RenderedSelection, Selector } from "../selection/selector";
import type { ThemeAreaTracker, ThemeSwitchable } from "../themes";

export interface RenderableMap extends Renderable, ThemeSwitchable {
    themeAreaTracker: ThemeAreaTracker
    selector: RenderedSelection
}