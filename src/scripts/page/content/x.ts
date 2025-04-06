import type { CustomPointerEventMap } from "../pointer-events/types"
import type { MarkSlot } from "../ui"

export interface XParent {
    notifyXDoubleClicked(): void
}

export class X {
    private readonly doubleClickListener: (ev: CustomPointerEventMap['dblclick']) => void

    public constructor(
        private readonly cell: MarkSlot,
        parent: XParent
    ){
        cell.displayX();
        this.doubleClickListener = () => parent.notifyXDoubleClicked();
        cell.addEventListener('dblclick', this.doubleClickListener);
    }

    public destroy(): void {
        this.cell.removeEventListener('dblclick', this.doubleClickListener);
    }
}