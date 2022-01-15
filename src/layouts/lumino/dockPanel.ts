import { customElement, ChangeMap, css, display, html, ref } from "../../common";
import { DockPanel, Widget } from "@lumino/widgets";
import { IMessageHandler, Message, MessageLoop } from "@lumino/messaging";
import { HPCCLuminoElement } from "./common";
import { dockpanel, dragdrop, splitpanel, tabbar, tabpanel, widget } from "./styles";
import { dockpanel as dockpanelTheme, tabbar as tabbarTheme } from "./theme";
import { WidgetAdapter } from "./widgetAdapter";

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
export class HPCCDockPanelElement extends HPCCLuminoElement {

    protected _dockPanel?: DockPanel;

    _div: HTMLDivElement;

    constructor() {
        super();
        this._dockPanel = new DockPanel({ document: this.shadowRoot! });
        Widget.attach(this._dockPanel, this._div);
        MessageLoop.installMessageHook(this._dockPanel, this);
        this.construct((w: WidgetAdapter, e: HTMLElement, ref?: Widget) => this.addWidget(w, e, ref));
    }

    addWidget(w: WidgetAdapter, e: HTMLElement, ref?: Widget): void {
        this._dockPanel?.addWidget(w, {
            mode: e.dataset.mode as DockPanel.InsertMode,
            ref
        });
    }

    enter() {
        super.enter();
    }

    update(changes: ChangeMap) {
        super.update(changes);
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
