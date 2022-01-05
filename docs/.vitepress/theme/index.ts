import DefaultTheme from "vitepress/theme";

if (import.meta.env.MODE === "development") {
    import("../../../src/index");
}

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
    },
    vueOptions: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => {
                    return tag.toLowerCase().indexOf("hpcc-") === 0;
                }
            }
        }
    }
};
