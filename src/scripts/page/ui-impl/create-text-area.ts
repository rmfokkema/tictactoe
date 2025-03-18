import type { InfiniteCanvasRenderingContext2D } from "ef-infinite-canvas";
import type { Theme } from "../themes";
import type { TextAreaMeasurements } from "./text-area-measurements";
import type { RenderableMapPart } from "./renderable-map-part";
import { getTranslations } from "../get-translations";

interface CalculatedMeasurements {
    scalingFactor: number
    titleHeight: number
}

export function createTextArea(
    {x, y, width, height, rotated}: TextAreaMeasurements,
    initialTheme: Theme
): RenderableMapPart {
    let theme = initialTheme;
    let calculated: CalculatedMeasurements | undefined;
    const translations = getTranslations();
    const title = translations.title;
    const explanation = translations.explanation;
    return {
        draw(ctx) {
            ctx.save();
            ctx.font = '3em Helvetica';
            ctx.textBaseline = 'top'
            const { scalingFactor, titleHeight } = getCalculatedMeasurements(ctx);
            if(rotated){
                ctx.transform(-scalingFactor, 0, 0, -scalingFactor, x + width, y + height)
            }else{
                ctx.transform(scalingFactor, 0, 0, scalingFactor, x, y)
            }
            
            ctx.fillStyle = theme.color;
            ctx.fillText(title, 0, 0);
            ctx.font = '1em Helvetica';
            ctx.fillText(explanation, 0, titleHeight * 1.2)
            ctx.restore();
        },
        setTheme(value) {
            theme = value;
        },
    }
    function getCalculatedMeasurements(ctx: InfiniteCanvasRenderingContext2D): CalculatedMeasurements {
        if(calculated){
            return calculated;
        }
        const metrics = ctx.measureText(title);
        const ratio = metrics.width / width;
        const scalingFactor = ratio > 1 ? 1 / ratio : 1;
        const titleHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const result: CalculatedMeasurements = {
            scalingFactor,
            titleHeight
        }
        calculated = result;
        return result;
    }
}