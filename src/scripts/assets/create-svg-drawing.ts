import type { Drawing } from '../shared/drawing'

interface State {
    lineColor: string
    lineWidth: number
}
export interface SvgDrawing extends Drawing {
    getResult(): string
}

export function createSvgDrawing(width: number, height: number): SvgDrawing {
    let currentResult = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
    const stateStack: State[] = [{lineColor: '#000', lineWidth: 1}];
    return {
        save,
        restore,
        setLineColor(color: string){
            getCurrentState().lineColor = color;
        },
        setLineWidth(width: number){
            getCurrentState().lineWidth = width;
        },
        addLine(fromX: number, fromY: number, toX: number, toY: number){
            const {lineColor, lineWidth} = getCurrentState();
            currentResult += `<line x1="${fromX}" y1="${fromY}" x2="${toX}" y2="${toY}" stroke="${lineColor}" stroke-width="${lineWidth}"/>`;
        },
        addRectangle(x: number, y: number, width: number, height: number, color: string){
            currentResult += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}"/>`
        },
        addCircle(cx: number, cy: number, r: number){
            const {lineColor, lineWidth} = getCurrentState();
            currentResult += `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="${lineColor}" stroke-width="${lineWidth}" fill="rgba(0, 0, 0, 0)"/>`
        },
        getResult(){
            return currentResult + `</svg>`;
        }
    }
    function save(): void{
        const currentState = getCurrentState();
        const newCurrentState: State = {...currentState};
        stateStack.push(newCurrentState);
    }
    function restore(): void {
        if(stateStack.length < 2){
            return;
        }
        stateStack.pop();
    }
    function getCurrentState(): State {
        return stateStack[stateStack.length - 1];
    }
}