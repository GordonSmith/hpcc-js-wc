import { Widget } from "@lumino/widgets";
import { Message } from "@lumino/messaging";
import { HPCCElement } from "../../common";

export class WidgetAdapter extends Widget {

    constructor(protected _host: HPCCElement, node: HTMLElement) {
        super({ node });
        this.addClass("hpcc-LuminoAdapter");
    }

    protected onCloseRequest(msg: Message): void {
        const cancelled = !this._host.$emit("closeRequest", this.node);
        if (!cancelled) {
            super.onCloseRequest(msg);
        }
    }
}
