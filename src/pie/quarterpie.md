# Quarter Pie

::: warning
This is currently a POC repository and has not been released to the npmjs repository.
:::

**tag**: `<hpcc-quarterpie>`

<ClientOnly>
  <hpcc-preview style="width:100%;height:400px">
    <hpcc-quarterpie style="width:100%;height:100%">
    </hpcc-quarterpie>
    <script>
      document.querySelector("hpcc-quarterpie").columns = ["Subject", "Score"];
      document.querySelector("hpcc-quarterpie").data = [
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
See [Getting Started](../../README) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCQuarterPieElement`

## Events