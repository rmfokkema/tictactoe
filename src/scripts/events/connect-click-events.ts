import { AcceptableClickEventAtTarget, AcceptedClickEvent, ClickEvent, ClickEventType, ClickHandler, DownwardsClickEvent, PointerEventTargetLike } from "./types"


abstract class BaseClickEvent implements ClickEvent{
    public abstract readonly type: ClickEventType;
    public abstract readonly x: number
    public abstract readonly y: number
    public abstract accept(_: ClickHandler): void
    public atTarget(target: ClickHandler): AcceptableClickEventAtTarget {
        return new AcceptableClickEventAtTargetImpl(this, target);
    }
    public forChild(): DownwardsClickEvent {
        return new DownwardsClickEventImpl(this)
    }
    public maybeAccepted(): AcceptedClickEvent | undefined {
        if(this.type === 'down'){
            return undefined;
        }
        return new AcceptedClickEventAtTarget(this.x, this.y, this.type);
    }
}
class ClickEventImpl extends BaseClickEvent{
    public target: ClickHandler | undefined;
    public type: ClickEventType = 'down'
    public constructor(
        public id: number,
        public x: number,
        public y: number
    ){
        super()
    }
    public accept(handler: ClickHandler): void{
        this.target = handler;
    }
}

class AcceptableClickEventAtTargetImpl implements AcceptableClickEventAtTarget{
    public accepted = false;
    public rejected = false;
    public readonly type = 'down'
    public get x(): number {return this.event.x;}
    public get y(): number {return this.event.y;}
    public constructor(
        private readonly event: ClickEvent,
        private readonly target: ClickHandler
    ){}
    public accept(): void {
        this.event.accept(this.target);
        this.accepted = true;
    }
    public reject(): void {
        this.rejected = true;
    }
}

class DownwardsClickEventImpl extends BaseClickEvent implements DownwardsClickEvent{
    public accepted = false;
    public readonly type = 'down'
    public get x(): number {return this.event.x;}
    public get y(): number {return this.event.y;}
    public constructor(private readonly event: ClickEvent){
        super();
    }
    public accept(handler: ClickHandler): void {
        this.event.accept(handler);
        this.accepted = true;
    }
    public reject(): void {}

    public maybeAccepted(): AcceptedClickEvent | undefined {
        return undefined;
    }
}

class AcceptedClickEventAtTarget implements AcceptedClickEvent{
    public constructor(
        public x: number,
        public y: number,
        public type: 'up' | 'cancel'
    ){}
}

export function connectClickEvents(
    pointerEvents: PointerEventTargetLike,
    handler: ClickHandler
): void{
    let theEvent: ClickEventImpl | undefined = undefined;
    pointerEvents.addEventListener('pointerdown', (e) => {
        if(theEvent === undefined){
            theEvent = new ClickEventImpl(e.pointerId, e.offsetX, e.offsetY);
            handler.handleClick(theEvent);
            if((theEvent.target) && e.pointerType === 'mouse'){
                e.preventDefault();
            }
        }else{
            const handler = theEvent.target;
            if(handler){
                theEvent.type = 'cancel';
                handler.handleClick(theEvent);
            }
            theEvent = undefined;
        }
    })
    pointerEvents.addEventListener('pointerup', (e: PointerEvent) => {
        if(theEvent && theEvent.id === e.pointerId){
            const handler = theEvent.target;
            if(handler){
                theEvent.type = 'up';
                handler.handleClick(theEvent);
            }
            theEvent = undefined;
        }
    })
    pointerEvents.addEventListener('pointermove', (e) => {
        if(theEvent && theEvent.id === e.pointerId){
            const handler = theEvent.target;
            if(handler){
                theEvent.type = 'cancel';
                handler.handleClick(theEvent);
            }
            theEvent = undefined;
        }
    })
}