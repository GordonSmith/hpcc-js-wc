# Gauge

**tag**: `<hpcc-gauge>`

<ClientOnly>
  <hpcc-preview preview_border="0px" preview_height_ratio=0.33 style="width:100%;height:400px">
    <hpcc-splitpanel style="width:100%;height:100%">
      <hpcc-gauge show_tick title="G-01" title_description="Gauge 01" style="width:100%;min-width:48px;height:100%">
      </hpcc-gauge>
      <hpcc-gauge title="G-02" style="width:100%;min-width:48px;height:100%">
      </hpcc-gauge>
      <hpcc-gauge show_tick title="G-03" style="width:100%;min-width:48px;height:100%">
      </hpcc-gauge>
      <hpcc-gauge title="G-04" style="width:100%;min-width:48px;height:100%">
      </hpcc-gauge>
    </hpcc-splitpanel>
    <script>
        for (const gauge of document.querySelectorAll("hpcc-gauge")) {
            gauge.value = Math.random();
            gauge.tick_value = Math.random();
        }
    </script>
  </hpcc-preview>
</ClientOnly>

::: tip
See [Getting Started](../../README) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCGaugeElement`

## Events
