import { ClickEvent, ClickHandlerNode, NodeClickHandler } from "./types";

export class ClickHandlerNodeImpl implements ClickHandlerNode{
    private children: ClickHandlerNodeImpl[] = [];
    private handler: NodeClickHandler | undefined
    public constructor(private readonly parent: ClickHandlerNodeImpl | undefined){

    }
    public onClick(handler: NodeClickHandler): void{
        this.handler = handler;
    }
    public child(): ClickHandlerNodeImpl {
        const child = new ClickHandlerNodeImpl(this);
        this.children.push(child);
        return child;
    }
    public destroy(): void{
        const children = this.children.splice(0);
        for(const child of children){
            child.destroy();
        }
        this.handler = undefined;
        this.parent?.removeChild(this);
    }
    public removeChild(node: ClickHandlerNodeImpl): void{
        const index = this.children.indexOf(node);
        if(index === -1){
            return;
        }
        this.children.splice(index, 1);
    }
    public handleClick(click: ClickEvent): void {
        const accepted = click.maybeAccepted();
        if(accepted){
            this.handler?.(accepted);
            return;
        }
        const acceptable = click.atTarget(this);
        this.handler?.(acceptable);
        if(acceptable.accepted || acceptable.rejected){
            return;
        }
        for(const child of this.children){
            const forChild = click.forChild();
            child.handleClick(forChild);
            if(forChild.accepted){
                return;
            }
        }
    }
    public static create(): ClickHandlerNodeImpl {
        return new ClickHandlerNodeImpl(undefined);
    }
}