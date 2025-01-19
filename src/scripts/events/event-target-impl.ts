import { Measurements, measurementsInclude } from "../measurements";
import { CustomPointerEventDispatcher, CustomPointerEventMap, CustomPointerEventTarget, PointerDownEventResult } from "./types";

export class EventTargetImpl implements CustomPointerEventDispatcher {
    private readonly children: EventTargetImpl[] = [];
    private readonly listeners: {[key in keyof CustomPointerEventMap]: ((ev: CustomPointerEventMap[key]) => void)[]} = {
        pointerdown: [],
        clickcancel: [],
        dblclickcancel: [],
        dblclick: [],
        click: []
    };
    public constructor(
        private readonly area: Measurements | undefined,
        private readonly parent: EventTargetImpl | undefined
    ){}
    private dispatchEvent<TType extends keyof CustomPointerEventMap>(type: TType, event: CustomPointerEventMap[TType]): void{
        for(const listener of this.listeners[type].slice()){
            listener(event);
        }
    }
    private removeChild(child: EventTargetImpl): void{
        const index = this.children.indexOf(child);
        if(index === -1){
            return;
        }
        this.children.splice(index, 1)
    }
    public dispatchPointerDown(event: PointerEvent): PointerDownEventResult {
        let cancelClickAllowed = false;
        let cancelDoubleClickAllowed = false;
        const customEvent: CustomPointerEventMap['pointerdown'] =  {
            type: 'pointerdown',
            allowCancelClick(){
                cancelClickAllowed = true;
            },
            allowCancelDoubleClick(){
                cancelDoubleClickAllowed = true;
            }
        }
        this.dispatchEvent('pointerdown', customEvent);
        return { cancelClickAllowed, cancelDoubleClickAllowed };
    }
    public dispatchClickCancel(): void {
        const event: CustomPointerEventMap['clickcancel'] =  {
            type: 'clickcancel'
        }
        this.dispatchEvent('clickcancel', event);
    }
    public dispatchDoubleClickCancel(): void {
        const event: CustomPointerEventMap['dblclickcancel'] =  {
            type: 'dblclickcancel'
        }
        this.dispatchEvent('dblclickcancel', event);
    }
    public dispatchClick(): void {
        const event: CustomPointerEventMap['click'] =  {
            type: 'click'
        }
        this.dispatchEvent('click', event)
    }
    public dispatchDoubleClick(): void {
        const event: CustomPointerEventMap['dblclick'] =  {
            type: 'dblclick'
        }
        this.dispatchEvent('dblclick', event)
    }
    public addEventListener<TType extends keyof CustomPointerEventMap>(
        type: TType,
        listener: (ev: CustomPointerEventMap[TType]) => void): void {
            this.listeners[type].push(listener);
    }
    public removeEventListener<TType extends keyof CustomPointerEventMap>(
        type: TType,
        listener: (ev: CustomPointerEventMap[TType]) => void): void {
            const listeners = this.listeners[type];
            const index = listeners.indexOf(listener);
            if(index === -1){
                return;
            }
            listeners.splice(index, 1);
    }
    public addChildForArea(area: Measurements): CustomPointerEventTarget{
        const child = new EventTargetImpl(area, this);
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