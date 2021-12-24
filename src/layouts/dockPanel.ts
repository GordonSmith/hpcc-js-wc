import { display } from "@microsoft/fast-foundation";
import { HPCCResizeElement, customElement, css, html, ref, ChangeMap, attribute } from "../common/element";
import { DockPanel, Widget } from "@lumino/widgets";
import { MessageLoop } from "@lumino/messaging";
import { WidgetAdapter } from "./lumino/widgetAdapter";
import * as luminoStyles from "./lumino/styles";
import * as luminoTheme from "./lumino/theme";

const template = html<HPCCDockPanelElement>`
    <div ${ref("_div")} style="width:${s => s.width};height:${s => s.height}">
    </div>
`;

const styles = css`
${display("inline")} :host {
}

:host > div {
}

${luminoStyles.all}

${luminoTheme.all}

.hpcc-LuminoAdapter {
    padding: 8px;
    border: 1px solid #c0c0c0;
    border-top: none;
}
`;

@customElement({ name: "hpcc-dockpanel", template, styles })
export class HPCCDockPanelElement extends HPCCResizeElement {

    _div: HTMLDivElement;

    protected _dockPanel?: DockPanel;

    constructor() {
        super();
    }

    enter() {
        super.enter();
        this._dockPanel = new DockPanel({ document: this.shadowRoot! });
        MessageLoop.sendMessage(this._dockPanel, Widget.Msg.BeforeAttach);
        this._div.append(this._dockPanel.node);
        MessageLoop.sendMessage(this._dockPanel, Widget.Msg.AfterAttach);
        let i = 0;
        while (this.children.length > 0) {
            const node = this.children[0] as HTMLElement;
            const w = new WidgetAdapter(node);
            w.title.label = `Widget ${++i}`;
            this._dockPanel.addWidget(w, { mode: "split-right" });
        }
    }

    update(changes: ChangeMap) {
        super.update(changes);
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
