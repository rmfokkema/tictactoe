import type { Renderable } from "../renderer/types";
import type { ThemeAreaTracker, ThemeSwitchable } from "../themes";

export interface RenderableMap extends Renderable, ThemeSwitchable {
    themeAreaTracker: ThemeAreaTracker
}