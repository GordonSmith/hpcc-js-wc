import { HPCCResizeElement } from "../../common";
import { Widget } from "@lumino/widgets";
import { WidgetAdapter } from "./widgetAdapter";
import { isTrue } from "../../util";

let hpccSlotID = 0;

export class HPCCLuminoElement extends HPCCResizeElement {
    protected _slot: HTMLSlotElement;

    private _constructed = false;
    construct(addWidget: (w: WidgetAdapter, e: HTMLElement, ref?: Widget) => void) {
        if (this._constructed) return;
        const codeElements = this._slot.assignedElements();
        this._constructed = codeElements.length > 0;
        const widgetIdx: { [id: string]: WidgetAdapter } = {};
        for (let i = 0; i < codeElements.length; ++i) {
            const e = codeElements[i] as HTMLElement;
            e.setAttribute("slot", `slot_${++hpccSlotID}`);
            const slot = document.createElement("slot");
            slot.setAttribute("name", `slot_${hpccSlotID}`);
            slot.style.cssText = e.style.cssText;
            slot.style.display = "inline-block";
            const w = new WidgetAdapter(this, slot);
            widgetIdx[w.id] = w;
            w.title.label = e.dataset.label || (e.id && `#${e.id}`) || `${e.tagName} ${i} `;
            w.title.closable = isTrue(e.dataset.closable);
            w.title.caption = e.dataset.caption || w.title.label;
            w.title.className = e.dataset.className || "";
            w.title.iconClass = e.dataset.iconClass || "";
            w.title.iconLabel = e.dataset.iconLabel || "";
            addWidget(w, e, e.dataset.ref ? widgetIdx[e.dataset.ref] : undefined);
        }
    }

    destruct() {
        for (let i = 0; i < this.childElementCount; ++i) {
            this.children[i].setAttribute("slot", "");
        }
    }
}
