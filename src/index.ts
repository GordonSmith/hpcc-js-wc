export * from "./common";
export * from "./codemirror";
export * from "./layouts";
export * from "./gauge";
export * from "./observable";
export * from "./pie";
export * from "./preview";
export * from "./sankey";
export * from "./treemap";
export * from "./util";

function itemReady(item: string): Promise<CustomElementConstructor> {
    return customElements.whenDefined(item);
}

export async function ready(...args: string[]) {
    return Promise.all(args.map(itemReady));
}
