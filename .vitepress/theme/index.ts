//@ts-ignore
import DefaultTheme from "vitepress/theme";

//@ts-ignore
if (import.meta.env.MODE === "development") {
    import("../../dist/index.esm");
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
