# CodeMirror Editor

::: warning
This is currently a POC repository and has not been released to the npmjs repository.
:::

**tag**: `<hpcc-codemirror>`

<ClientOnly>
  <hpcc-preview preview_border="0px" preview_height_ratio=0.5 style="width:100%;height:400px">
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
