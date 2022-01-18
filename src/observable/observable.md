# Observable

**tag**: `<hpcc-observable>`

<ClientOnly>
  <hpcc-preview style="width:100%;height:800px">
    <hpcc-observable style="width:100%;height:100%">
      md`# Confirmed Cases v Deaths (${my_country}) - ${lastDate.toLocaleDateString("en-US", {dateStyle: "medium"})}`

      chart;

      //  Dependencies
      my_country = "Germany";
      import { chart, lastDate } with { my_country as overrideLocation } from "@gordonsmith/irish-confirmed-cases-v-deaths";
    </hpcc-observable>
  </hpcc-preview>
</ClientOnly>

::: tip
See [Getting Started](../../README) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCObservableElement`

## Events

## More Examples

### Observable Markdown

**tag**:  `<hpcc-observable mode="markdown">`

<ClientOnly>
  <hpcc-preview style="width:100%;height:800px">
    <hpcc-observable mode="markdown" style="width:100%;height:100%">
      # Liquid Fun

      ```
      canvas;

      //  Dependencies
      import { canvas } from "@mbostock/liquidfun";
      ```
    </hpcc-observable>
  </hpcc-preview>
</ClientOnly>
