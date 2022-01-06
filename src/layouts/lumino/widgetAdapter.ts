import { Widget } from "@lumino/widgets";
import { Message } from "@lumino/messaging";
import { HPCCElement } from "../../common";

export class WidgetAdapter extends Widget {

    constructor(protected _host: HPCCElement, node: Element) {
        super({ node: node as HTMLElement });
        this.addClass("hpcc-LuminoAdapter");
    }

    protected onResize(msg: Widget.ResizeMessage): void {
        super.onResize(msg);
    }

    protected onCloseRequest(msg: Message): void {
        const cancelled = !this._host.$emit("closeRequest", this.node);
        if (!cancelled) {
            super.onCloseRequest(msg);
        }
    }
}
