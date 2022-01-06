# Dock Panel

**tag**: `<hpcc-dockpanel>`

<ClientOnly>
  <hpcc-preview previewBorder="0px" width="100%" height="400px">
    <hpcc-dockpanel width="100%" height="400px">
      <div id="one" data-label="AAAA" style="overflow:auto;min-width:48px;min-height:48px">
        <h1>AAAA HTML Ipsum Presents</h1>
        <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
      </div>
      <div id="three" data-mode="split-right" data-closable="true" style="overflow:auto;min-width:48px;min-height:48px">
        <h1>CCCC HTML Ipsum Presents</h1>
        <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
      </div>
      <div data-mode="tab-after" data-ref="three" data-caption="What no label!" style="overflow:auto;min-width:48px;min-height:48px">
        <h1>DDDD HTML Ipsum Presents</h1>
        <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
      </div>
      <div data-mode="split-bottom" data-ref="one" style="overflow:auto;min-width:48px;min-height:48px">
        <h1>BBBB HTML Ipsum Presents</h1>
        <p><strong>Pellentesque habitant morbi tristique</strong> senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. <em>Aenean ultricies mi vitae est.</em> Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, <code>commodo vitae</code>, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. <a href="#">Donec non enim</a> in turpis pulvinar facilisis. Ut felis.</p>
      </div>
    </hpcc-dockpanel>
  </hpcc-preview>
</ClientOnly>

::: tip
See [Getting Started](../guide/getting-started.md) for details on how to include @hpcc-js/web-components in your application
:::

## `HPCCDockPanelElement`

## Events

### `changed`

_Emitted whenever the content is panned or zoomed_

## Child Element `data-???` attributes

### `data-label`

_The tabbed panel will display this text as the tab label_

**Type**: `string`

**Default Value**: Will first revert to the `id` of the child element and then the element `tag` if no `id`.

### `data-mode`

_How the child element will be displayed in the tabbed panel_

**Type**: `split-top | split-left | split-right | split-bottom | tab-before | tab-after`

* `split-top`: The child element will be displayed above the `data-ref` element.
* `split-left`: The child element will be displayed to the left of the `data-ref` element.
* `split-right`: The child element will be displayed to the right of the `data-ref` element.
* `split-bottom`: The child element will be displayed below the `data-ref` element.
* `tab-before`: The child element will be inserted as a tab before the `data-ref` element.
* `tab-after`: The child element will be appended as a tab after the `data-ref` element.

**Default Value**: `tab-after`

### `data-ref`

_The reference element `id` used when appending child items (optional)_

**Type**: `string`

**Default Value:**  When omitted the previous child element will be used as the reference.

### `data-closable`

_Allow a tabbed item to be closed by clicking on the displayed "close" button_

**Type:** `boolean`

**Default Value:** `false`

### `data-caption`

__The tooltip text for the tabbed item__

**Type:** `string`

**Default Value:** `"`
