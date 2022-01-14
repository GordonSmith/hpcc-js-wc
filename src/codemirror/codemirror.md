# CodeMirror Editor

**tag**: `<hpcc-codemirror>`

<ClientOnly>
  <hpcc-preview previewBorder="0px" previewHeightRatio=0.5 style="width:100%;height:400px">
      <hpcc-codemirror mode="json" theme="dark" style="width:100%;height:100%">
      </hpcc-codemirror>
      <script>
          document.querySelector('hpcc-codemirror').text = `\
    {
      "aaa":123, 
      "bbb":"ddd", 
      "c":3, 
      "d":true
    }`;
      </script>
  </hpcc-preview>
</ClientOnly>

::: tip
See [Getting Started](../../README) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCCodemirrorElement`

## Events
