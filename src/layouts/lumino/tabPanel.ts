import { customElement, css, display, html, ref, ChangeMap, attribute } from "../../common";
import { TabPanel, Widget } from "@lumino/widgets";
import { HPCCLuminoElement } from "./common";
import { tabbar, tabpanel, widget } from "./styles";
import { tabbar as tabbarTheme } from "./theme";
import { WidgetAdapter } from "./widgetAdapter";

const template = html<HPCCTabPanelElement>`\
<div ${ref("_div")}>
</div>
<slot ${ref("_slot")}></slot>`;

const styles = css`
${display("inline-block")} 

:host > slot {
    visibility: hidden;
}

${widget}
${tabbar}
${tabpanel}

${tabbarTheme}

.hpcc-LuminoAdapter {
    padding: 8px;
    border: 1px solid #c0c0c0;
}

:host-context([tabPlacement="top"]) .hpcc-LuminoAdapter  {
    border-top: none;
}

:host-context([tabPlacement="bottom"]) .hpcc-LuminoAdapter  {
    border-bottom: none;
}
`;

@customElement("hpcc-tabpanel", { template, styles })
export class HPCCTabPanelElement extends HPCCLuminoElement {

    /**
     *  Whether the tabs are movable by the user
     * 
     * @defaultValue false
     */
    @attribute({ type: "boolean" }) tabsMovable: boolean = false;

    /**
     *  Whether the button to add new tabs is enabled
     * 
     * @defaultValue false
     */
    @attribute({ type: "boolean" }) addButtonEnabled: boolean = false;

    /**
     *  The placement of the tab bar relative to the content 
     * 
     * @defaultValue "top"
     */
    @attribute tabPlacement: "top" | "left" | "right" | "bottom" = "top";

    protected _div: HTMLDivElement;
    protected _slot: HTMLSlotElement;
    protected _tabPanel: TabPanel = new TabPanel({ document: this.shadowRoot!, tabsMovable: this.tabsMovable, addButtonEnabled: this.addButtonEnabled, tabPlacement: this.tabPlacement });

    constructor() {
        super();
    }

    addWidget(w: WidgetAdapter, _e: HTMLElement, _ref?: Widget): void {
        this._tabPanel?.addWidget(w);
    }

    enter() {
        super.enter();
        Widget.attach(this._tabPanel, this._div);
        this.construct((w: WidgetAdapter, e: HTMLElement, ref?: Widget) => this.addWidget(w, e, ref));
    }

    update(changes: ChangeMap) {
        super.update(changes);
        this._tabPanel.tabsMovable = this.tabsMovable;
        this._tabPanel.addButtonEnabled = this.addButtonEnabled;
        this._tabPanel.tabPlacement = this.tabPlacement;
        this._tabPanel.node.style.width = `${this.clientWidth}px`;
        this._tabPanel.node.style.height = `${this.clientHeight}px`;
        this._tabPanel.update();
    }

    exit() {
        this.destruct();
        Widget.detach(this._tabPanel);
        super.exit();
    }
}
