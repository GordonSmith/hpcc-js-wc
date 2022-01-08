import { HPCCElement } from "./element";
import { HTMLTemplate } from "./html";

//  Web Component Meta Data  ---

export interface Property {
    name: string;
    isAttribute: boolean;
}

export interface ClassMeta {
    template?: HTMLTemplate;
    styles: string;
    properties: Property[];
    observedAttributes: string[];
    observedProperties: string[];
    observed: string[];
}

const _allMeta = new WeakMap<CustomElementConstructor, ClassMeta>();
function initMeta(target: CustomElementConstructor): ClassMeta {
    let retVal: ClassMeta;
    if (!_allMeta.has(target)) {
        retVal = {
            template: { html: "", directives: [] },
            styles: "",
            properties: [],
            observedAttributes: [],
            observedProperties: [],
            observed: []
        };
        _allMeta.set(target, retVal);
    } else {
        retVal = _allMeta.get(target)!;
    }
    return retVal;
}

export function classMeta(target: CustomElementConstructor): Readonly<ClassMeta> {
    return _allMeta.get(target)!;
}

export function instanceMeta(target: HPCCElement): Readonly<ClassMeta> {
    return initMeta(Object.getPrototypeOf(target).constructor);
}

//  Web Component Decarators  ---

export type CustomElementOption = { template?: HTMLTemplate, styles?: string };

export function customElement(name: string, opts?: CustomElementOption): (target: CustomElementConstructor) => void {

    const { template = { html: "", directives: [] }, styles = "" }: CustomElementOption = opts || {};

    function decorator(target: CustomElementConstructor): void {
        const meta = initMeta(target);

        //  Gather inherited meta  ---
        let allProperties: Property[] = [];

        let self = target;
        while (true) {
            allProperties = allProperties.concat(initMeta(self).properties);
            if (self === HPCCElement) {
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
    const meta = initMeta(target.constructor as CustomElementConstructor);
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
        get: function () { return this[innerID]; }
    });
}

export interface DecoratorAttributeConfiguration {
    mode?: "string" | "boolean" | "number";
}

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
