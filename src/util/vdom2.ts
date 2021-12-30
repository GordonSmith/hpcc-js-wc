type VProps = Record<string, unknown>;

interface VElement {
    type: string;
    props: VProps;
    children: VNode[];
}
type VNode = VElement | string;

export function h(type: string, props: VProps = {}, ...children: VNode[]): VElement {
    return { type, props, children };
}

function setBooleanProp($target: HTMLElement, name: string, value: boolean) {
    if (value) {
        $target.setAttribute(name, `${value}`);
        $target[name] = true;
    } else {
        $target[name] = false;
    }
}

function removeBooleanProp($target: HTMLElement, name: string) {
    $target.removeAttribute(name);
    $target[name] = false;
}

function isEventProp(name: string): boolean {
    return /^on/.test(name);
}

function extractEventName(name: string): string {
    return name.slice(2).toLowerCase();
}

function isCustomProp(name: string): boolean {
    return isEventProp(name) || name === "forceUpdate";
}

function setProp($target: HTMLElement, name: string, value: string | boolean): void {
    if (isCustomProp(name)) {
        return;
    } else if (typeof value === "boolean") {
        setBooleanProp($target, name, value);
    } else if (name === "className") {
        $target.setAttribute("class", value);
    } else {
        $target.setAttribute(name, value);
    }
}

function removeProp($target: HTMLElement, name: string, value: string): void {
    if (isCustomProp(name)) {
        return;
    } else if (name === "className") {
        $target.removeAttribute("class");
    } else if (typeof value === "boolean") {
        removeBooleanProp($target, name);
    } else {
        $target.removeAttribute(name);
    }
}

function setProps($target: HTMLElement, props: VProps) {
    Object.keys(props).forEach(name => {
        setProp($target, name, props[name] as any);
    });
}

function updateProp($target: HTMLElement, name, newVal, oldVal) {
    if (!newVal) {
        removeProp($target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
        setProp($target, name, newVal);
    }
}

function updateProps($target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(name => {
        updateProp($target, name, newProps[name], oldProps[name]);
    });
}

function addEventListeners($target, props) {
    Object.keys(props).forEach(name => {
        if (isEventProp(name)) {
            $target.addEventListener(
                extractEventName(name),
                props[name]
            );
        }
    });
}

function createElement(node) {
    if (typeof node === "string") {
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);
    setProps($el, node.props);
    addEventListeners($el, node.props);
    node.children
        .map(createElement)
        .forEach($el.appendChild.bind($el));
    return $el;
}

function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
        typeof node1 === "string" && node1 !== node2 ||
        node1.type !== node2.type ||
        node1.props && node1.props.forceUpdate;
}

function updateElement($parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
        $parent.appendChild(
            createElement(newNode)
        );
    } else if (!newNode) {
        $parent.removeChild(
            $parent.childNodes[index]
        );
    } else if (changed(newNode, oldNode)) {
        $parent.replaceChild(
            createElement(newNode),
            $parent.childNodes[index]
        );
    } else if (newNode.type) {
        updateProps(
            $parent.childNodes[index],
            newNode.props,
            oldNode.props
        );
        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for (let i = 0; i < newLength || i < oldLength; i++) {
            updateElement(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i],
                i
            );
        }
    }
}