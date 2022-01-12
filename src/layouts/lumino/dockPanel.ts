import { HPCCResizeElement, customElement, ChangeMap, css, display, html, ref } from "../../common";
import { DockPanel, Widget } from "@lumino/widgets";
import { IMessageHandler, Message, MessageLoop } from "@lumino/messaging";
import { WidgetAdapter } from "./widgetAdapter";
import { dockpanel, dragdrop, splitpanel, tabbar, tabpanel, widget } from "./styles";
import { dockpanel as dockpanelTheme, tabbar as tabbarTheme } from "./theme";
import { isTrue } from "../../util";

const template = html<HPCCDockPanelElement>`\
<div ${ref("_div")}>
</div>
<slot ${ref("_slot")}></slot>`;

const styles = css`
${display("inline-block")} 

:host > slot {
    visibility: hidden;
}

${dragdrop}
${widget}
${splitpanel}
${tabbar}
${tabpanel}
${dockpanel}

${dockpanelTheme}
${tabbarTheme}

.hpcc-LuminoAdapter {
    padding: 8px;
    border: 1px solid #c0c0c0;
    border-top: none;
}
`;

@customElement("hpcc-dockpanel", { template, styles })
export class HPCCDockPanelElement extends HPCCResizeElement {

    protected _dockPanel?: DockPanel;

    _div: HTMLDivElement;
    protected _slot: HTMLSlotElement;

    constructor() {
        super();
    }

    private _constructed = false;
    construct() {
        if (this._constructed) return;
        const codeElements = this._slot.assignedElements();
        this._constructed = codeElements.length > 0;
        const widgetIdx: { [id: string]: WidgetAdapter } = {};
        for (let i = 0; i < codeElements.length; ++i) {
            const e = codeElements[i] as HTMLElement;
            const w = new WidgetAdapter(this, e);
            widgetIdx[w.id] = w;
            w.title.label = e.dataset.label || (e.id && `#${e.id}`) || `${e.tagName} ${i} `;
            w.title.closable = isTrue(e.dataset.closable);
            w.title.caption = e.dataset.caption || w.title.label;
            w.title.className = e.dataset.className || "";
            w.title.iconClass = e.dataset.iconClass || "";
            w.title.iconLabel = e.dataset.iconLabel || "";
            this._dockPanel!.addWidget(w, {
                mode: e.dataset.mode as DockPanel.InsertMode,
                ref: e.dataset.ref ? widgetIdx[e.dataset.ref] : undefined
            });
        }
    }

    enter() {
        super.enter();
        this._dockPanel = new DockPanel({ document: this.shadowRoot! });
        Widget.attach(this._dockPanel, this._div);
        MessageLoop.installMessageHook(this._dockPanel, this);
        this.construct();
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this.construct();
        this._dockPanel!.node.style.width = `${this.clientWidth}px`;
        this._dockPanel!.node.style.height = `${this.clientHeight}px`;
        this._dockPanel!.update();
    }

    exit() {
        Widget.detach(this._dockPanel!);
        delete this._dockPanel;
        super.exit();
    }

    //  Lumino Messaging  ---
    messageHook(handler: IMessageHandler, msg: Message): boolean {
        if (handler === this._dockPanel) {
            switch (msg.type) {
                case "layout-modified":
                    this.$emit("layoutChanged", this);
                    break;
            }
        }
        return true;
    }

}
