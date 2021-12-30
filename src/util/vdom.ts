type VProps = Record<string, unknown>;

interface VElement {
    tag: string;
    props: VProps;
    children: VNode[];
}
type VNode = VElement | string;

export const Fragment = "div";

export function h(tag: string, props: VProps = {}, ...children: VNode[]): VElement {
    return { tag, props, children };
}

export function createElement(vnode: VNode): HTMLElement | Text {
    if (typeof vnode === "string") return document.createTextNode(vnode);

    const el = document.createElement(vnode.tag);

    for (const prop in vnode.props) {
        el[prop] = vnode.props[prop];
    }

    for (const child of Array.from(vnode.children)) {
        el.appendChild(createElement(child));
    }

    return el;
}

export function createElements(vnode: VNode): Array<HTMLElement | Text> {
    if (typeof vnode !== "string" && vnode.tag === Fragment) {
        return vnode.children.map(createElement);
    }
    return [createElement(vnode)];
}

function patch(el: HTMLElement | Text, newVNode?: VNode, oldVNode?: VNode): void {
    if (!newVNode && newVNode !== "") return el.remove();
    if (typeof oldVNode === "string" || typeof newVNode === "string") {
        if (oldVNode !== newVNode) return el.replaceWith(createElement(newVNode));
    } else {
        if (oldVNode?.tag !== newVNode?.tag) {
            return el.replaceWith(createElement(newVNode));
        }

        for (const prop in { ...oldVNode.props, ...newVNode.props }) {
            if (newVNode.props[prop] === undefined) {
                delete el[prop];
            } else if (
                oldVNode.props[prop] === undefined ||
                oldVNode.props[prop] !== newVNode.props[prop]
            ) {
                el[prop] = newVNode.props[prop];
            }
        }

        for (let i = (oldVNode.children?.length ?? 0) - 1; i >= 0; --i) {
            patch(
                <HTMLElement | Text>el.childNodes[i],
                (newVNode.children || [])[i],
                oldVNode.children[i],
            );
        }

        for (let i = oldVNode.children?.length ?? 0; i < newVNode.children?.length ?? 0; i++) {
            el.appendChild(createElement(newVNode.children[i]));
        }
    }
}

export function render(vnode: VNode, el: HTMLElement): void {
    patch(el, vnode);
}
