import { EventDispatcher } from "../events/event-dispatcher";
import { measurementsInclude } from "../measurements";
import type { Measurements } from "@shared/drawing";
import type { CustomPointerEventDispatcher, CustomPointerEventMap, CustomPointerEventTarget } from "./types";

export class PointerEventTargetImpl implements CustomPointerEventDispatcher {
    private readonly children: PointerEventTargetImpl[] = [];
    private readonly eventDispatcher: EventDispatcher<CustomPointerEventMap>;

    public constructor(
        private readonly area: Measurements | undefined,
        private readonly parent: PointerEventTargetImpl | undefined
    ){
        this.eventDispatcher = new EventDispatcher({
            pointerdown: [],
            clickcancel: [],
            dblclickcancel: [],
            dblclick: [],
            click: []
        })
    }

    private removeChild(child: PointerEventTargetImpl): void{
        const index = this.children.indexOf(child);
        if(index === -1){
            return;
        }
        this.children.splice(index, 1)
    }

    public dispatchClick(): void {
        const event: CustomPointerEventMap['click'] =  {
            type: 'click'
        }
        this.eventDispatcher.dispatchEvent('click', event)
    }
    public dispatchDoubleClick(): void {
        const event: CustomPointerEventMap['dblclick'] =  {
            type: 'dblclick'
        }
        this.eventDispatcher.dispatchEvent('dblclick', event)
    }
    public addEventListener<TType extends keyof CustomPointerEventMap>(
        type: TType,
        listener: (ev: CustomPointerEventMap[TType]) => void): void {
            this.eventDispatcher.addEventListener(type, listener);
    }
    public removeEventListener<TType extends keyof CustomPointerEventMap>(
        type: TType,
        listener: (ev: CustomPointerEventMap[TType]) => void): void {
           this.eventDispatcher.removeEventListener(type, listener);
    }
    public addChildForArea(area: Measurements): CustomPointerEventTarget{
        const child = new PointerEventTargetImpl(area, this);
        this.children.push(child);
        return child;
    }
    public findTarget(x: number, y: number): CustomPointerEventDispatcher | undefined {
        if(this.area && !measurementsInclude(this.area, x, y)){
            return undefined;
        }
        for(const child of this.children){
            const targetInChild = child.findTarget(x, y);
            if(targetInChild){
                return targetInChild;
            }
        }
        return this;
    }
    public destroy(){
        this.children.splice(0)
        if(this.parent){
            this.parent.removeChild(this)
        }
    }
}