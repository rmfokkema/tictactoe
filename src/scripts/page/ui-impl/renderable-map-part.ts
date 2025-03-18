import type { Renderable } from "../renderer/types";
import type { Theme } from "../themes";
import type { Themeable } from "../ui/themeable";

export interface RenderableMapPart extends Renderable, Themeable<Theme> {

}