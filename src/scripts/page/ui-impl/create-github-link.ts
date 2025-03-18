import type { Rerenderer } from "../renderer/types";
import type { Theme } from "../themes/themes";
import type { GithubLinkMeasurements } from "./github-link-measurements";
import lightIconUrl from '../../../github-icon-light.svg';
import darkIconUrl from '../../../github-icon-dark.svg';
import type { RenderableMapPart } from "./renderable-map-part";
import type { CustomPointerEventTarget } from "../pointer-events/types";
import { openUrl } from "../open-url";

export function createGithubLink(
    {x, y, width, height, rotated}: GithubLinkMeasurements,
    initialTheme: Theme,
    rerenderer: Rerenderer,
    eventTarget: CustomPointerEventTarget,
): RenderableMapPart {
    let theme = initialTheme;
    const darkImage = new Image();
    darkImage.onload = () => rerenderer.rerender();
    darkImage.src = darkIconUrl;
    const lightImage = new Image();
    lightImage.onload = () => rerenderer.rerender();
    lightImage.src = lightIconUrl;
    const linkTarget = eventTarget.addChildForArea({x, y, width, height});
    linkTarget.addEventListener('click', () => openUrl('https://github.com/emilefokkema/tictactoe'))
    return {
        draw(ctx) {
            ctx.save();
            if(rotated){
                ctx.transform(-1, 0, 0, -1, x + width, y + height)
            }else{
                ctx.transform(1, 0, 0, 1, x, y);
            }
            if(theme.variant === 'light'){
                ctx.drawImage(darkImage, 0, 0, width, height)
            }else{
                ctx.drawImage(lightImage, 0, 0, width, height)
            }
            ctx.restore();
        },
        setTheme(value) {
            theme = value;
        },
    }
}