# Gauge

**tag**: `<hpcc-gauge>`

<ClientOnly>
  <hpcc-preview previewBorder="0px" previewHeightRatio=0.33 style="width:100%;height:400px">
    <hpcc-splitPanel style="width:100%;height:100%">
      <hpcc-gauge showTick title="G-01" titleDescription="Gauge 01" style="width:100%;min-width:48px;height:100%">
      </hpcc-gauge>
      <hpcc-gauge title="G-02" style="width:100%;min-width:48px;height:100%">
      </hpcc-gauge>
      <hpcc-gauge showTick title="G-03" style="width:100%;min-width:48px;height:100%">
      </hpcc-gauge>
      <hpcc-gauge title="G-04" style="width:100%;min-width:48px;height:100%">
      </hpcc-gauge>
    </hpcc-splitPanel>
    <script>
      for (const gauge of document.querySelectorAll("hpcc-gauge")) {
        gauge.value = Math.random();
        gauge.tickValue = Math.random();
      }
    </script>
  </hpcc-preview>
</ClientOnly>

::: tip
See [Getting Started](../../README) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCGaugeElement`

## Events
