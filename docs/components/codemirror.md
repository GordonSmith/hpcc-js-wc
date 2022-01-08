# CodeMirror Editor

**tag**: `<hpcc-codemirror>`

<ClientOnly>
  <hpcc-preview previewBorder="0px" style="width:100%;height:400px">
      <hpcc-codemirror mode="json" theme="light" style="width:100%;height:100%">
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
See [Getting Started](../guide/getting-started.md) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCCodemirrorElement`

## Events
