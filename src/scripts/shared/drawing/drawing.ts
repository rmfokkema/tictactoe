export interface Drawing {
    setLineColor(color: string): void
    setLineWidth(width: number): void
    save(): void
    restore(): void
    addLine(fromX: number, fromY: number, toX: number, toY: number): void
    addRectangle(x: number, y: number, width: number, height: number, color: string): void
    addCircle(cx: number, cy: number, r: number): void
}