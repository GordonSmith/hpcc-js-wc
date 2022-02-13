# Gauge

::: warning
This is currently a POC repository and has not been released to the npmjs repository.
:::

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
See [Getting Started](../../../README) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCGaugeElement`

## Events

## Credits

### d3

_D3 (or D3.js) is a JavaScript library for visualizing data using web standards. D3 helps you bring data to life using SVG, Canvas and HTML. D3 combines powerful visualization and interaction techniques with a data-driven approach to DOM manipulation, giving you the full capabilities of modern browsers and the freedom to design the right visual interface for your data._

* [Home Page](https://d3js.org/)
* [GitHub](https://github.com/d3/d3)

### d3-svg-annotation

_Annotations establish context, and direct our users to insights and anomalies. So why are annotations so few and far between in visualizations on the web? Because implementing them is difficult._

* [Home Page](https://d3-annotation.susielu.com/)
* [GitHub](https://github.com/susielu/d3-annotation)

