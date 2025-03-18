import type { Measurements } from "../measurements";

interface Segment {
    start: number
    length: number
}
function intersectSegments({start: start1, length: length1}: Segment, {start: start2, length: length2}: Segment): Segment | undefined {
    if(start1 < start2){
        if(start1 + length1 < start2){
            return undefined;
        }
        return { start: start2, length: Math.min(start1 + length1, start2 + length2) - start2}
    }
    if(start2 + length2 < start1){
        return undefined;
    }
    return { start: start1, length: Math.min(start1 + length1, start2 + length2) - start1}
}
function segmentFrom({start, length}: Segment, from: number): Segment | undefined {
    if(start < from){
        if(start + length < from){
            return undefined;
        }
        return {start: from, length: start + length - from}
    }
    return {start, length};
}
function intersectMeasurements(one: Measurements, other: Measurements): Measurements | undefined {
    const horizontal = intersectSegments({start: one.x, length: one.width}, {start: other.x, length: other.width});
    if(!horizontal){
        return undefined;
    }
    const vertical = intersectSegments({start: one.y, length: one.height}, {start: other.y, length: other.height});
    if(!vertical){
        return undefined;
    }
    return {
        x: horizontal.start,
        y: vertical.start,
        width: horizontal.length,
        height: vertical.length
    }
}
function measurementsRightOf(measurements: Measurements, rightOf: Measurements): Measurements | undefined {
    const right = rightOf.x + rightOf.width;
    const horizontal = segmentFrom({start: measurements.x, length: measurements.width}, right);
    if(!horizontal){
        return undefined;
    }
    return {
        x: horizontal.start,
        y: measurements.y,
        width: horizontal.length,
        height: measurements.height
    }
}

export class Layout implements Measurements {
    private constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        private readonly children: Layout[]
    ){}

    private transform(t: (measurements: Measurements) => Measurements): Layout {
        const newChildren: Layout[] = [];
        for(const child of this.children){
            newChildren.push(child.transform(t))
        }
        const {x, y, width, height} = t(this);
        return new Layout(x, y, width, height, newChildren);
    }

    private contains(layout: Layout): boolean {
        if(layout === this){
            return true;
        }
        for(const child of this.children){
            if(child.contains(layout)){
                return true;
            }
        }
        return false;
    }

    public translate(dx: number, dy: number): Layout {
        return this.transform(({x, y, width, height}) => ({x: x + dx, y: y + dy, width, height}))
    }

    public intersect(other: Measurements): Layout | undefined {
        const intersectedMeasurements = intersectMeasurements(this, other);
        if(!intersectedMeasurements){
            return undefined;
        }
        const newChildren: Layout[] = [];
        for(const child of this.children){
            const intersected = child.intersect(other);
            if(!intersected){
                continue;
            }
            newChildren.push(intersected)
        }
        return new Layout(
            intersectedMeasurements.x,
            intersectedMeasurements.y,
            intersectedMeasurements.width,
            intersectedMeasurements.height,
            newChildren
        )
    }

    public rightOf(other: Measurements): Layout | undefined {
        const intersectedMeasurements = measurementsRightOf(this, other);
        if(!intersectedMeasurements){
            return undefined;
        }
        const newChildren: Layout[] = [];
        for(const child of this.children){
            const intersected = child.rightOf(other);
            if(!intersected){
                continue;
            }
            newChildren.push(intersected)
        }
        return new Layout(
            intersectedMeasurements.x,
            intersectedMeasurements.y,
            intersectedMeasurements.width,
            intersectedMeasurements.height,
            newChildren
        )
    }

    public flipAroundMainDiagonal(): Layout {
        return this.transform(({x, y, width, height}) => ({x: y, y: x, width: height, height: width}))
    }

    public rotateLeft(): Layout {
        return this.transform(({x, y, width, height}) => ({x: y, y: -x - width, width: height, height: width}))
    }

    public scale(sx: number, sy: number): Layout {
        return this.transform(({x, y, width, height}) => ({
            x: x * sx,
            y: y * sy,
            width: width * sx,
            height: height * sy
        }))
    }

    public ensureAspectRatio(ratio: number, maximum: boolean, extend: boolean): Layout {
        const diff = ratio / (this.width / this.height);
        if(maximum && diff < 1){
            if(extend){
                return this.scale(1, 1 / diff);
            }
            return this.scale(diff, 1)
        }
        if(!maximum && diff > 1){
            if(extend){
                return this.scale(diff, 1)
            }
            return this.scale(1, 1 / diff);
        }
        return this;
    }

    public withinPadding(top: number, right: number, bottom: number, left: number): Layout {
        return this
            .translate(-this.x, -this.y)
            .scale(
                (this.width - left - right) / this.width,
                (this.height - top - bottom) / this.height
            )
            .translate(this.x + left, this.y + top)
    }

    public centeredIn({x, y, width, height}: Measurements): Layout {
        const translateX = x + (width - this.width) / 2 - this.x;
        const translateY = y + (height - this.height) / 2 - this.y;
        return this.translate(translateX, translateY);
    }

    public fitInside({x, y, width, height}: Measurements): Layout {
        const scale = Math.min(width / this.width, height / this.height);
        return this.scale(scale, scale).centeredIn({x, y, width, height});
    }

    public addChild(child: Layout, parent?: Layout): Layout {
        if(parent && !this.contains(parent)){
            return this;
        }
        const newChildren: Layout[] = [];
        if(!parent || parent === this){
            newChildren.push(...this.children);
            newChildren.push(child);
        }else{
            for(const ownChild of this.children){
                newChildren.push(ownChild.addChild(child, parent))
            }
        }
        return new Layout(this.x, this.y, this.width, this.height, newChildren);
    }

    public getChild([childIndex, ...path]: number[]): Layout | undefined {
        if(path.length === 0){
            return this.children[childIndex];
        }
        return this.children[childIndex].getChild(path);
    }

    public static create(x: number, y: number, width: number, height: number): Layout {
        return new Layout(x, y, width, height, [])
    }
}



