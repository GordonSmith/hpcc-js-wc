# Pie

::: warning
This is currently a POC repository and has not been released to the npmjs repository.
:::

**tag**: `<hpcc-pie>`

<ClientOnly>
  <hpcc-preview preview_border="0px" style="width:100%;height:400px">
    <hpcc-splitpanel style="width:100%;height:100%">
      <hpcc-pie style="width:100%;min-width:48px;height:100%">
      </hpcc-pie>
      <hpcc-pie inner_radius=80 style="width:100%;min-width:48px;height:100%">
      </hpcc-pie>
    </hpcc-splitpanel>
    <script>
      for (const pie of document.querySelectorAll("hpcc-pie")) {
        pie.columns = ["Subject", "Score"];
        pie.data = [
          ["Math", 88],
          ["English", 72],
          ["Science", 60],
          ["History", 50],
          ["Geography", 40],
          ["Biology", 30],
          ["Physics", 20],
          ["Chemistry", 10]
        ];
      }
    </script>
  </hpcc-preview>
</ClientOnly>

::: tip
See [Getting Started](../../../README) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCPieElement`

## Events

## More Examples

### Start Angle

**tag**: `<hpcc-pie start_angle=${i}>`

<ClientOnly>
  <hpcc-preview preview_border="0px" style="width:100%;height:400px">
    <hpcc-splitpanel style="width:100%;height:100%">
      <hpcc-pie style="width:100%;min-width:48px;height:100%">
      </hpcc-pie>
      <hpcc-pie inner_radius=80 style="width:100%;min-width:48px;height:100%">
      </hpcc-pie>
    </hpcc-splitpanel>
    <script>
      const pies = document.querySelectorAll("hpcc-pie");
      for (const pie of pies) {
        pie.columns = ["Subject", "Score"];
        pie.data = [
          ["Math", 88],
          ["English", 72],
          ["Science", 60],
          ["History", 50],
          ["Geography", 40],
          ["Biology", 30],
          ["Physics", 20],
          ["Chemistry", 10]
        ];
      }
      let i = 0;
      setInterval(()=>{
        let j = 0;
        for (const pie of pies) {
          pie.setAttribute("start_angle", j % 2 === 0 ? i :-i);
          ++j;
        }
        i += 3;
      }, 150)
    </script>

  </hpcc-preview>
</ClientOnly>

## Credits

### d3

_D3 (or D3.js) is a JavaScript library for visualizing data using web standards. D3 helps you bring data to life using SVG, Canvas and HTML. D3 combines powerful visualization and interaction techniques with a data-driven approach to DOM manipulation, giving you the full capabilities of modern browsers and the freedom to design the right visual interface for your data._

* [Home Page](https://d3js.org/)
* [GitHub](https://github.com/d3/d3)
