import { attribute, ChangeMap, customElement, HPCCElement, HPCCResizeElement, HTMLColor, property } from ".";

@customElement("hpcc-lite", "")
export class RectLite extends HPCCResizeElement {

    @attribute l = "100";
    @attribute c: HTMLColor = "red";
    @property t = "Some Inner Text";

    constructor() {
        super();

        this.shadowRoot!.innerHTML = `\
<style></style>
<div></div>
`;
    }

    enter() {
        super.enter();
        updateStyle(this);
    }

    update(changes: ChangeMap) {
        super.update(changes);
        updateStyle(this);
    }
}

function updateStyle(elem) {
    const shadow = elem.shadowRoot;
    const style = shadow.querySelector("style");
    style.textContent = `
      div {
        width: ${elem.l}px;
        height: ${elem.l}px;
        background-color: ${elem.getAttribute("c")};
      }
    `;
    shadow.querySelector("div")!.innerText = elem.t;
}
