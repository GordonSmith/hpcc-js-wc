# @hpcc-js/web-components

![GitHub](https://img.shields.io/github/license/GordonSmith/hpcc-js-wc) 
![GitHub branch checks state](https://img.shields.io/github/checks-status/GordonSmith/hpcc-js-wc/trunk)


`@hpcc-js/web-components` is a library of Web Components that focuses on visualizations.  It also includes communication libraries for interacting with [HPCC Platforms](https://github.com/hpcc-systems/HPCC-Platform).

## Installation

### From NPM

To install the `@hpcc-js/web-components` library, use either `npm` or `yarn` as follows:

```shell
npm install --save @hpcc-js/web-components
```

```shell
yarn add @hpcc-js/web-components
```

Within your JavaScript or TypeScript code, import the desired components (this is the recommended approach as it ensures that only the used components get included in your build - aka tree shaking):

```ts
import { HPCCSankeyElement, HPCCZoomElement } from "@hpcc-js/web-components";

HPCCSankeyElement; // Force bundler to include Sankey components
HPCCZoomElement; // Force bundler to include Zoom components
```

Alternatively you can easily register all components:

```ts
import * as all from "@hpcc-js/web-components";

all; // Force bundler to include all components
```
 
### From CDN

A pre-bundled script that contains all APIs needed to use FAST Foundation is available on CDN. You can use this script by adding [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to the script element and then importing from the CDN.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module" src="https://cdn.jsdelivr.net/npm/@hpcc-js/web-components/dist/index.min.js"></script>
    </head>
    <!-- ... -->
</html>
```

The markup above always references the latest release. When deploying to production, you will want to ship with a specific version. Here's an example of the markup for that:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@hpcc-js/web-components@1.2.3/dist/index.min.js"></script>
```

::: info
For simplicity, examples throughout the documentation will assume the library has been installed from NPM, but you can always replace the import location with the CDN URL.
:::

## Development

To start the component development environment:

```
git clone https://github.com/GordonSmith/hpcc-js-wc.git
cd hpcc-js-wc
npm install
npm run serve
```

In vscode pressing `ctrl+shift+b` will start the build and serve process.  Pressing `F5` will start debuggin in the browser.

