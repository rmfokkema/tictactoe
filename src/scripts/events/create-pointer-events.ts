import { Measurements, measurementsInclude } from "../measurements";
import { CustomPointerEventMap, CustomPointerEventTarget, PointerEventTargetLike } from "./types";

class EventTargetImpl implements CustomPointerEventTarget {
    private readonly children: EventTargetImpl[] = [];
    private readonly listeners: {[key in keyof CustomPointerEventMap]: ((ev: CustomPointerEventMap[key]) => void)[]} = {
        pointerdown: [],
        pointercancel: [],
        pointerup: []
    };
    public constructor(
        private readonly area: Measurements | undefined,
        private readonly parent: EventTargetImpl | undefined
    ){}
    public dispatchEvent<TType extends keyof CustomPointerEventMap>(type: TType, event: CustomPointerEventMap[TType]): void{
        for(const listener of this.listeners[type].slice()){
            listener(event);
        }
    }
    public addEventListener<TType extends keyof CustomPointerEventMap>(
        type: TType,
        listener: (ev: CustomPointerEventMap[TType]) => void): void {
            this.listeners[type].push(listener);
    }
    public addChildForArea(area: Measurements): CustomPointerEventTarget{
        const child = new EventTargetImpl(area, this);
        this.children.push(child);
        return child;
    }
    public findTarget(x: number, y: number): EventTargetImpl | undefined {
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
    public removeChild(child: EventTargetImpl): void{
        const index = this.children.indexOf(child);
        if(index === -1){
            return;
        }
        this.children.splice(index, 1)
    }
    public destroy(){
        this.children.splice(0)
        if(this.parent){
            this.parent.removeChild(this)
        }
    }
}

class ActivePointer {
    public cancelAllowed = false;
    public constructor(
        public pointerId: number,
        private readonly target: EventTargetImpl
    ){

    }
    public dispatchPointerDownEvent(): void{
        let cancelAllowed = false;
        const event: CustomPointerEventMap['pointerdown'] =  {
            type: 'pointerdown',
            allowCancel(){
                cancelAllowed = true;
            }
        }
        this.target.dispatchEvent('pointerdown', event)
        if(cancelAllowed){
            this.cancelAllowed = true;
        }
    }
    public dispatchPointerCancelEvent(): void {
        const event: CustomPointerEventMap['pointercancel'] =  {
            type: 'pointercancel'
        }
        this.target.dispatchEvent('pointercancel', event)
    }
    public dispatchPointerUpEvent(): void {
        const event: CustomPointerEventMap['pointerup'] =  {
            type: 'pointerup'
        }
        this.target.dispatchEvent('pointerup', event)
    }
}

export function createPointerEvents(
    pointerEvents: PointerEventTargetLike
): CustomPointerEventTarget {
    let activePointer: ActivePointer | undefined;
    const rootTarget = new EventTargetImpl(undefined, undefined);
    pointerEvents.addEventListener('pointerdown', (ev) => {
        if(activePointer === undefined){
            const target = rootTarget.findTarget(ev.offsetX, ev.offsetY);
            if(!target){
                return;
            }
            const newActivePointer = new ActivePointer(
                ev.pointerId,
                target
            );
            newActivePointer.dispatchPointerDownEvent();
            activePointer = newActivePointer;
            if(ev.pointerType === 'mouse' && activePointer.cancelAllowed){
                ev.preventDefault();
            }
        }else if(ev.pointerId !== activePointer.pointerId && activePointer.cancelAllowed){
            activePointer.dispatchPointerCancelEvent();
            activePointer = undefined;
        }
    });
    pointerEvents.addEventListener('pointerup', (ev) => {
        if(activePointer && ev.pointerId === activePointer.pointerId){
            activePointer.dispatchPointerUpEvent();
            activePointer = undefined;
        }
    });
    pointerEvents.addEventListener('pointermove', (ev) => {
        if(activePointer && ev.pointerId === activePointer.pointerId && activePointer.cancelAllowed){
            activePointer.dispatchPointerCancelEvent();
            activePointer = undefined;
        }
    });
    return rootTarget;
}