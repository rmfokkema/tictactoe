import { Measurements } from "../measurements";
import { ContentParent } from "./content";
import { ContentImpl } from "./content-impl";

export class Grid extends ContentImpl{
    private readonly lineWidth: number;
    private readonly bottom: number;
    private readonly right: number;
    private readonly vertical1: number;
    private readonly vertical2: number;
    private readonly horizontal1: number;
    private readonly horizontal2: number;
    public readonly cellSize: number;
    public constructor(
        parent: ContentParent,
        private readonly measurements: Measurements
    ){
        super(parent);
        const { size, x, y } = measurements;
        const lineWidth = this.lineWidth = size / 100;
        const cellSize = this.cellSize = (size - 2 * lineWidth) / 3;
        const right = this.right = x + size;
        this.vertical1 = x + cellSize + lineWidth / 2;
        this.vertical2 = right - cellSize - lineWidth / 2;
        const bottom = this.bottom = y + size;
        this.horizontal1 = y + cellSize + lineWidth / 2;
        this.horizontal2 = bottom - cellSize - lineWidth / 2;
    }

    public *getCellMeasurements(): Iterable<Measurements>{
        const {x, y, size} = this.measurements;
        const { vertical1, lineWidth, vertical2, horizontal1, horizontal2} = this;
        const cellSize = (size - 2 * this.lineWidth) / 3;
        for(let rowIndex = 0; rowIndex < 3; rowIndex++){
            for(let columnIndex = 0; columnIndex < 3; columnIndex++){
                const cellX = columnIndex === 0 ? x : columnIndex === 1 ? vertical1 + lineWidth / 2 : vertical2 + lineWidth / 2;
                const cellY = rowIndex === 0 ? y : rowIndex === 1 ? horizontal1 + lineWidth / 2 : horizontal2 + lineWidth / 2;
                yield {x: cellX, y: cellY, size: cellSize};
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const {x, y} = this.measurements;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.vertical1, y);
        ctx.lineTo(this.vertical1, this.bottom);
        ctx.moveTo(this.vertical2, y);
        ctx.lineTo(this.vertical2, this.bottom);
        ctx.moveTo(x, this.horizontal1);
        ctx.lineTo(this.right, this.horizontal1);
        ctx.moveTo(x, this.horizontal2);
        ctx.lineTo(this.right, this.horizontal2);
        ctx.stroke();
    }
}