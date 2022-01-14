# Pie

**tag**: `<hpcc-pie>`

<ClientOnly>
  <hpcc-preview previewBorder="0px" style="width:100%;height:400px">
    <hpcc-splitPanel style="width:100%;height:100%">
      <hpcc-pie style="width:100%;min-width:48px;height:100%">
      </hpcc-pie>
      <hpcc-pie innerRadius=80 style="width:100%;min-width:48px;height:100%">
      </hpcc-pie>
    </hpcc-splitPanel>
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
See [Getting Started](../../README) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCPieElement`

## Events
