import type { TransformationRepresentation } from "ef-infinite-canvas";
import type { ScreenMeasurements } from "../measurements";
import type { Measurements, Point } from "@shared/drawing";
import type { Renderable } from "../renderer/types";
import type { ThemeSwitchable, ThemeSwitchProperties } from "../themes/theme-switch";
import type { ScreenPositionCalculator } from "./screen-position";
import { Layout } from "./layout";
import type { TextAreaMeasurements } from "./text-area-measurements";
import type { GithubLinkMeasurements } from "./github-link-measurements";
import type { RenderableMapPart } from "./renderable-map-part";

export interface MapPartMeasurements {
    grid: Measurements
    textArea: TextAreaMeasurements
    githubLink: GithubLinkMeasurements
}
export interface Areas extends ThemeSwitchable, Renderable, ScreenPositionCalculator {
    getMeasurements(): {
        primary: MapPartMeasurements
        secondary: MapPartMeasurements
    },
    setParts(parts: {
        primary: RenderableMapPart
        secondary: RenderableMapPart
    }): void;
}
function getMeasurementsFromLayout(layout: Layout, rotated: boolean): MapPartMeasurements {
    const grid = layout.getChild([0, 0])!;
    const textArea = {...layout.getChild([0, 1])!, rotated};
    const githubLink = {...layout.getChild([0, 2])!, rotated};
    return { grid, textArea, githubLink }
}

export function createAreas(
    {width, height}: ScreenMeasurements,
    {primaryTheme: initialPrimaryTheme, secondaryTheme: initialSecondaryTheme}: ThemeSwitchProperties
): Areas {
    let primaryTheme = initialPrimaryTheme;
    let secondaryTheme = initialSecondaryTheme;
    let primaryPart: RenderableMapPart | undefined;
    let secondaryPart: RenderableMapPart | undefined;
    const allPoints: Point[] = [
        {x: 0, y: 0},
        {x: width, y: 0},
        {x: width, y: height},
        {x: 0, y: height}
    ];
    const squareSize = Math.max(width, height);
    const doubleSquareSize = 2 * squareSize;
    return {
        getScreenPosition({a, b, c, d, e, f}: TransformationRepresentation){
            let inPrimary = false;
            let inSecondary = false;
            for(const {x, y} of allPoints){
                const transformed = {
                    x: a * x + c * y + e,
                    y: b * x + d * y + f
                };
                const pointInPrimary = isInPrimaryArea(transformed);
                if(pointInPrimary){
                    if(inSecondary){
                        return {inPrimary: true, inSecondary};
                    }
                    inPrimary = true;
                }else{
                    if(inPrimary){
                        return {inSecondary: true, inPrimary};
                    }
                    inSecondary = true;
                }
            }
            return {inPrimary, inSecondary}
        },
        getMeasurements(){
            let mainLayout = Layout.create(0, 0, width, height);
            const margin = Math.min(width, height) / 20;
            const smallerMargin = margin / 2;
            const landscape = width > height;
            const aspectRatio = 1.3;
            const githubIconSize = smallerMargin / 2;
            let paddingLayout = mainLayout.withinPadding(margin, margin, margin, margin);
            if(landscape){
                paddingLayout = paddingLayout.ensureAspectRatio(aspectRatio, false, false);
            }else{
                paddingLayout = paddingLayout.ensureAspectRatio(1 / aspectRatio, true, false);
            }
            if(!landscape){
                paddingLayout = paddingLayout.flipAroundMainDiagonal();
            }
            let square: Layout;
            if(landscape){
                square = paddingLayout.intersect(
                    paddingLayout
                        .translate(-paddingLayout.x, -paddingLayout.y)
                        .flipAroundMainDiagonal()
                        .translate(paddingLayout.x, paddingLayout.y)
                    )!
            }else{
                square = paddingLayout.intersect(
                    paddingLayout
                        .translate(-paddingLayout.x, -paddingLayout.y)
                        .flipAroundMainDiagonal()
                        .translate(paddingLayout.x + githubIconSize + smallerMargin, paddingLayout.y)
                    )!
            }
            let rightOfSquare = paddingLayout.rightOf(square)!;
            rightOfSquare = rightOfSquare.intersect(rightOfSquare.translate(margin, 0))!;
            paddingLayout = paddingLayout.addChild(square).addChild(rightOfSquare).rotateLeft();
            if(landscape){
                paddingLayout = paddingLayout.rotateLeft();
            }
            let githubLink: Layout;
            if(landscape){
                const textAreaNow = paddingLayout.getChild([1])!;
                githubLink = textAreaNow.intersect(
                    textAreaNow.translate(
                        textAreaNow.width - githubIconSize,
                        textAreaNow.height - githubIconSize
                    )
                )!;
            }else{
                githubLink = paddingLayout.intersect(
                    paddingLayout.translate(
                        paddingLayout.width - githubIconSize,
                        paddingLayout.height - githubIconSize
                    )
                )!
            }

            paddingLayout = paddingLayout.addChild(githubLink);
            paddingLayout = paddingLayout.centeredIn(mainLayout);
            mainLayout = mainLayout.addChild(paddingLayout);

            const otherLayout = mainLayout.rotateLeft().rotateLeft().translate(doubleSquareSize, doubleSquareSize);

            return {
                primary: getMeasurementsFromLayout(mainLayout, false),
                secondary: getMeasurementsFromLayout(otherLayout, true)
            }
        },
        draw(ctx){
            ctx.save();
            ctx.fillStyle = primaryTheme.backgroundColor;
            ctx.beginPath();
            ctx.moveTo(squareSize, squareSize);
            ctx.lineToInfinityInDirection(1, -1);
            ctx.lineToInfinityInDirection(-1, -1);
            ctx.lineToInfinityInDirection(-1, 1);
            ctx.clip();
            ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity);
            primaryPart?.draw(ctx);
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(squareSize, squareSize);
            ctx.lineToInfinityInDirection(1, -1);
            ctx.lineToInfinityInDirection(1, 1);
            ctx.lineToInfinityInDirection(-1, 1);
            ctx.clip();
            ctx.fillStyle = secondaryTheme.backgroundColor;
            ctx.fillRect(-Infinity, -Infinity, Infinity, Infinity);
            secondaryPart?.draw(ctx)
            ctx.restore();
        },
        switchTheme(props){
            primaryTheme = props.primaryTheme;
            secondaryTheme = props.secondaryTheme;
            primaryPart?.setTheme(props.primaryTheme);
            secondaryPart?.setTheme(props.secondaryTheme);
        },
        setParts({primary, secondary}){
            primaryPart = primary;
            secondaryPart = secondary;
        }
    }
    function isInPrimaryArea(point: Point): boolean {
        return point.x + point.y < doubleSquareSize;
    }
}