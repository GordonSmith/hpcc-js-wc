import { HPCCCodemirrorElement } from ".";
import { HPCCResizeElement, ChangeMap, customElement, css, html, ref } from "../base/hpcc-element";

const template = html<HPCCPreviewElement>`
<div id="demo" sandbox style="height:${s => s.height}px;display:flex;flex-direction:column;">
    <iframe ${ref("iframe")} style="flex: 1 0 auto;">
    </iframe>
    <hpcc-codemirror ${ref("cm")} style="flex: 1 0 auto;">
    </hpcc-codemirror>
</div>
`;

const styles = css`
:host {
}
`;

@customElement({ name: "hpcc-preview", template, styles })
export class HPCCPreviewElement extends HPCCResizeElement {

    div: HTMLIFrameElement;
    iframe: HTMLIFrameElement;
    cm: HPCCCodemirrorElement;

    gatherScripts(node: HTMLElement, scripts: string[]): HTMLElement {
        const retVal = node.cloneNode() as typeof node;
        Array.prototype.slice.call(node.children, 0)
            .filter(child => child !== this)
            .filter(child => {
                return child.tagName !== "hpcc-preview".toUpperCase();
            })
            .forEach(child => {
                if (child.tagName === "SCRIPT") {
                    scripts.push(child.outerHTML);
                }
                const clone = this.gatherScripts(child, scripts);
                retVal.append(clone);
            })
            ;
        return retVal;
    }

    enter() {
        super.enter();
        const head = document.head.innerHTML;
        const scripts = [];
        const clone = this.gatherScripts(document.body, scripts);
        const body = clone.innerHTML;
        const codeElements = this.getElementsByTagName("code")[0];
        this.cm.text = codeElements?.innerText ?? "" + this.innerHTML;
        this.cm.addEventListener("change", (evt) => {
            this.iframe.contentWindow?.document.open();
            this.iframe.contentWindow?.document.write(`
<head>
${head}
</head>

<body>
${this.cm.text}
${scripts}
</body>
`);
            this.iframe.contentWindow?.document.close();
        });
    }

    update(changes: ChangeMap) {
        super.update(changes);
    }
}
