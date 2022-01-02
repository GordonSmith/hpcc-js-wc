import { HPCCDivElement, customElement, ChangeMap, css, display } from "../../common";
import { DockPanel, Widget } from "@lumino/widgets";
import { MessageLoop } from "@lumino/messaging";
import { WidgetAdapter } from "./widgetAdapter";
import * as luminoStyles from "./styles";
import * as luminoTheme from "./theme";

const isTrue = (value?: string | number | boolean): boolean => value === true || value === 1 || value === "true" || value === "1";

// const template = html<HPCCDockPanelElement>`
//     <div ${ref("_div")} style="width:${s => s.width};height:${s => s.height}">
//     </div>
// `;

const styles = css`
${display("inline")} 

:host {
}

:host > div {
}

${luminoStyles.all}

${luminoTheme.light.all}

.hpcc-LuminoAdapter {
    padding: 8px;
    border: 1px solid #c0c0c0;
    border-top: none;
}
`;

@customElement("hpcc-dockpanel", { styles })
export class HPCCDockPanelElement extends HPCCDivElement {

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
        const widgetIdx: { [id: string]: WidgetAdapter } = {};
        let i = 0;
        while (this.children.length > 0) {
            const node = this.children[0] as HTMLElement;
            const w = new WidgetAdapter(node);
            widgetIdx[w.id] = w;
            w.title.label = node.dataset.label || (node.id && `#${node.id}`) || `${node.tagName} ${++i} `;
            w.title.closable = isTrue(node.dataset.closable);
            w.title.caption = node.dataset.caption || w.title.label;
            w.title.className = node.dataset.className || "";
            w.title.iconClass = node.dataset.iconClass || "";
            w.title.iconLabel = node.dataset.iconLabel || "";
            this._dockPanel.addWidget(w, {
                mode: node.dataset.mode as DockPanel.InsertMode,
                ref: node.dataset.ref ? widgetIdx[node.dataset.ref] : undefined
            });
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
