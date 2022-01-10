# Pie

**tag**: `<hpcc-pie>`

<ClientOnly>
  <hpcc-preview style="width:100%;height:400px">
    <hpcc-pie style="width:100%;height:100%">
    </hpcc-pie>
    <script>
      document.querySelector("hpcc-pie").columns = ["Subject", "Score"];
      document.querySelector("hpcc-pie").data = [
        ["Math", 88],
        ["English", 72],
        ["Science", 60],
        ["History", 50],
        ["Geography", 40],
        ["Biology", 30],
        ["Physics", 20],
        ["Chemistry", 10]
      ];
    </script>
  </hpcc-preview>
</ClientOnly>

::: tip
See [Getting Started](../guide/getting-started.md) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCPieElement`

## Events
