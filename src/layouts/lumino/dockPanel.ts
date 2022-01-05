import { HPCCResizeElement, customElement, ChangeMap, css, display, html, ref } from "../../common";
import { DockPanel, Widget } from "@lumino/widgets";
import { MessageLoop } from "@lumino/messaging";
import { WidgetAdapter } from "./widgetAdapter";
import * as luminoStyles from "./styles";
import * as luminoTheme from "./theme";
import { isTrue } from "../../util";

const template = html<HPCCDockPanelElement>`\
<div ${ref("_div")}>
</div>
<slot ${ref("_slot")}></slot>`;

const styles = css`
${display("inline")} 

:host {
}

:host > div {
}

${luminoStyles.dragdrop}
${luminoStyles.widget}
${luminoStyles.dockpanel}
${luminoStyles.splitpanel}
${luminoStyles.tabbar}
${luminoStyles.tabpanel}

${luminoTheme.dockpanel}
${luminoTheme.tabbar}

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
            const w = new WidgetAdapter(e);
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
        MessageLoop.sendMessage(this._dockPanel, Widget.Msg.BeforeAttach);
        this._div.append(this._dockPanel.node);
        MessageLoop.sendMessage(this._dockPanel, Widget.Msg.AfterAttach);
        this.construct();
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this.construct();
        this._dockPanel!.node.style.width = this.widthString;
        this._dockPanel!.node.style.height = this.heightString;
        this._dockPanel!.update();
    }

    exit() {
        MessageLoop.sendMessage(this._dockPanel!, Widget.Msg.BeforeDetach);
        this._dockPanel!.node.parentNode?.removeChild(this._dockPanel!.node);
        MessageLoop.sendMessage(this._dockPanel!, Widget.Msg.AfterDetach);
        delete this._dockPanel;
        super.exit();
    }
}
