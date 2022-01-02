import { attribute, ChangeMap, HPCCDivElement, customElement, css } from "../common";
import { display } from "@microsoft/fast-foundation";

// const template = html<HPCCPanelElement>`
//     <div style="height:${s => s.innerHeight}px">
//         <slot></slot>
//     </div>
// `;

const styles = css`
${display("inline")} :host {
}

:host > div {
    background-color: pink;
    border: solid 1px navy;
    overflow: auto;
`;

@customElement("hpcc-panel", { styles })
export class HPCCPanelElement extends HPCCDivElement {
}
