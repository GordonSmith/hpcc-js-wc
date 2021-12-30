import type { HPCCElement } from "./element";

interface Property {
    name: string;
    isAttribute: boolean;
}

interface ClassMeta {
    template?: string;
    styles: string;
    properties: Property[];
    observedAttributes: string[];
    observedProperties: string[];
    observed: string[];
}

const _allMeta: { [className: string]: ClassMeta } = {};
export function classMeta(className: string): ClassMeta {
    if (!_allMeta[className]) {
        _allMeta[className] = {
            template: "",
            styles: "",
            properties: [],
            observedAttributes: [],
            observedProperties: [],
            observed: []
        };
    }
    return _allMeta[className];
}

export function customElement(name: string, styles: string, template?: string): (target: CustomElementConstructor) => void {

    function decorator(target: CustomElementConstructor): void {
        const meta = classMeta(target.name);

        //  Gather inherited meta  ---
        let allProperties: Property[] = [];

        let self = target;
        while (true) {
            allProperties = [...allProperties, ...classMeta(self.name).properties];
            if (self?.name === "HPCCElement") {
                break;
            }
            self = Object.getPrototypeOf(self);
        }
        meta.template = template;
        meta.styles = styles;
        meta.observedAttributes = allProperties
            .filter(prop => prop.isAttribute)
            .map(prop => prop.name)
            ;
        meta.observedProperties = allProperties
            .filter(prop => !prop.isAttribute)
            .map(prop => prop.name)
            ;
        meta.observed = allProperties.map(prop => prop.name);
        customElements?.define(name, target);
        return;
    }

    return decorator;
}

function changedHandler(target: HPCCElement, prop: string, isAttribute) {
    const meta = classMeta(target.constructor.name);
    meta.properties.push({
        name: prop,
        isAttribute
    });
    const innerID = `_${prop}`;
    Object.defineProperty(target, prop, {
        set: function (newVal) {
            const oldVal = this[innerID];
            this[innerID] = newVal;
            this._fire(prop, oldVal, newVal);
        },
        get: function () { return this[`_${prop}`]; }
    });
}

declare type AttributeConfiguration = {
    property: string;
};

export declare type DecoratorAttributeConfiguration = Omit<AttributeConfiguration, "property">;

export function attribute(config?: DecoratorAttributeConfiguration): (target: HPCCElement, property: string) => void;
export function attribute(target: HPCCElement, prop: string): void;
export function attribute(configOrTarget?: DecoratorAttributeConfiguration | HPCCElement, prop?: string): void | ((target: HPCCElement, property: string) => void) {

    function decorator($target: HPCCElement, $prop: string): void {
        changedHandler($target, $prop, true);
        return;
    }

    if (arguments.length > 1) {
        decorator(configOrTarget as HPCCElement, prop!);
        return;
    }

    return decorator;
}

export function property(config?: DecoratorAttributeConfiguration): (target: HPCCElement, property: string) => void;
export function property(target: HPCCElement, prop: string): void;
export function property(configOrTarget?: DecoratorAttributeConfiguration | HPCCElement, prop?: string): void | ((target: HPCCElement, property: string) => void) {

    function decorator($target: HPCCElement, $prop: string): void {
        changedHandler($target, $prop, false);
        return;
    }

    if (arguments.length > 1) {
        decorator(configOrTarget as HPCCElement, prop!);
        return;
    }

    return decorator;
}
