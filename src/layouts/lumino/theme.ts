import { css } from "../../common";

export namespace light {
  export const accordionpanel = css`
.lm-AccordionPanel .lm-AccordionPanel-title {
    box-sizing: border-box;
    padding: 0px 10px;
    background: #e5e5e5;
    border: 1px solid #c0c0c0;
    border-bottom: none;
    font: 12px Helvetica, Arial, sans-serif;
    min-height: 22px;
    max-height: 22px;
    min-width: 35px;
    line-height: 20px;
    margin: 0px;
  }
  
  .lm-AccordionPanel .lm-AccordionPanel-title:focus,
  .lm-AccordionPanel .lm-AccordionPanel-title:hover {
    background: #dbdbdb;
  }
  
  .lm-AccordionPanel .lm-AccordionPanel-title:focus,
  .lm-AccordionPanel
    .lm-AccordionPanel-title:last-of-type:focus:not(.lm-mod-expanded) {
    border: 1px solid lightskyblue;
  }
  
  .lm-AccordionPanel .lm-AccordionPanel-title:last-of-type:not(.lm-mod-expanded) {
    border-bottom: 1px solid #c0c0c0;
  }
  
  .lm-AccordionPanel
    .lm-AccordionPanel-title.lm-mod-expanded
    .lm-AccordionPanel-titleCollapser:before {
    content: '\f0d8';
    font-family: FontAwesome;
  }
  
  .lm-AccordionPanel
    .lm-AccordionPanel-title
    .lm-AccordionPanel-titleCollapser:before {
    content: '\f0d7';
    font-family: FontAwesome;
    position: absolute;
    right: 10px;
  }
  
  .lm-AccordionPanel .lm-AccordionPanel-titleLabel {
    padding: 0px 5px;
  }
  `;

  export const commandpalette = css`
/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

/* <DEPRECATED> */
.p-CommandPalette, /* </DEPRECATED> */
.lm-CommandPalette {
  font-family: sans-serif;
  background: #f5f5f5;
}

/* <DEPRECATED> */
.p-CommandPalette-search, /* </DEPRECATED> */
.lm-CommandPalette-search {
  padding: 8px;
}

/* <DEPRECATED> */
.p-CommandPalette-wrapper, /* </DEPRECATED> */
.lm-CommandPalette-wrapper {
  padding: 4px 6px;
  background: white;
  border: 1px solid #e0e0e0;
  position: relative;
}

/* <DEPRECATED> */
.p-CommandPalette-input, /* </DEPRECATED> */
.lm-CommandPalette-input {
  width: 92%;
  border: none;
  outline: none;
  font-size: 16px;
}

/* <DEPRECATED> */
.p-CommandPalette-header, /* </DEPRECATED> */
.lm-CommandPalette-header {
  padding: 4px;
  color: #757575;
  font-size: 12px;
  font-weight: 600;
  background: #e1e1e1;
  cursor: pointer;
}

/* <DEPRECATED> */
.p-CommandPalette-header:hover::before, /* </DEPRECATED> */
.lm-CommandPalette-header:hover::before {
  content: '\2026'; /* ellipsis */
  float: right;
  margin-right: 4px;
}

/* <DEPRECATED> */
.p-CommandPalette-header > mark, /* </DEPRECATED> */
.lm-CommandPalette-header > mark {
  background-color: transparent;
  font-weight: bold;
}

/* <DEPRECATED> */
.p-CommandPalette-item, /* </DEPRECATED> */
.lm-CommandPalette-item {
  padding: 4px 8px;
  color: #757575;
  font-size: 13px;
  font-weight: 500;
}

/* <DEPRECATED> */
.p-CommandPalette-emptyMessage, /* </DEPRECATED> */
.lm-CommandPalette-emptyMessage {
  padding: 4px;
  color: #757575;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

/* <DEPRECATED> */
.p-CommandPalette-item.p-mod-disabled, /* </DEPRECATED> */
.lm-CommandPalette-item.lm-mod-disabled {
  color: rgba(0, 0, 0, 0.25);
}

/* <DEPRECATED> */
.p-CommandPalette-item.p-mod-active, /* </DEPRECATED> */
.lm-CommandPalette-item.lm-mod-active {
  background: #7fdbff;
}

/* <DEPRECATED> */
.p-CommandPalette-item:hover:not(.p-mod-active):not(.p-mod-disabled),
/* </DEPRECATED> */
.lm-CommandPalette-item:hover:not(.lm-mod-active):not(.lm-mod-disabled) {
  background: #e5e5e5;
}

/* <DEPRECATED> */
.p-CommandPalette-itemIcon, /* </DEPRECATED> */
.lm-CommandPalette-itemIcon {
  display: none;
}

/* <DEPRECATED> */
.p-CommandPalette-itemLabel > mark, /* </DEPRECATED> */
.lm-CommandPalette-itemLabel > mark {
  background-color: transparent;
  font-weight: bold;
}

/* <DEPRECATED> */
.p-CommandPalette-item.p-mod-disabled mark,
/* </DEPRECATED> */
.lm-CommandPalette-item.lm-mod-disabled mark {
  color: rgba(0, 0, 0, 0.4);
}

/* <DEPRECATED> */
.p-CommandPalette-itemCaption, /* </DEPRECATED> */
.lm-CommandPalette-itemCaption {
  color: #9e9e9e;
  font-size: 11px;
  font-weight: 400;
}
`;

  export const datagrid = css`
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2018, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

/* <DEPRECATED> */
.p-DataGrid, /* </DEPRECATED> */
.lm-DataGrid {
  min-width: 64px;
  min-height: 64px;
  border: 1px solid #a0a0a0;
}

/* <DEPRECATED> */
.p-DataGrid-scrollCorner, /* </DEPRECATED> */
.lm-DataGrid-scrollCorner {
  background-color: #f0f0f0;
}

/* <DEPRECATED> */
.p-DataGrid-scrollCorner::after, /* </DEPRECATED> */
.lm-DataGrid-scrollCorner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background-color: #a0a0a0;
}

.lm-DataGrid-cellEditorOccluder {
  pointer-events: none;
  position: absolute;
  overflow: hidden;
}

.lm-DataGrid-cellEditorContainer {
  pointer-events: auto;
  position: absolute;
  background-color: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 6px #006bf7;
  border: 2px solid #006bf7;
}

.lm-DataGrid-cellEditorContainer.lm-mod-invalid {
  box-shadow: 0px 0px 6px red;
  border: 2px solid red;
}

.lm-DataGrid-cellEditorContainer > form {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lm-DataGrid-cellEditorWidget {
  width: 100%;
  height: 100%;
  outline: none;
  box-sizing: border-box;
}

.lm-DataGrid-cellEditorInput {
  background-color: #ffffff;
  border: 0;
}

.lm-DataGrid-cellEditorCheckbox {
  margin: 0;
}

.lm-DataGrid-notification {
  position: absolute;
  display: flex;
  overflow: visible;
  animation: fade-in 300ms ease-out;
}

.lm-DataGrid-notificationContainer {
  box-shadow: 0px 2px 5px #999999;
  border-radius: 3px;
  background-color: white;
  color: black;
  border: 1px solid black;
  font-family: sans-serif;
  font-size: 13px;
  padding: 4px;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
`;

  export const dockpanel = css`
/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

/* <DEPRECATED> */
.p-DockPanel-overlay, /* </DEPRECATED> */
.lm-DockPanel-overlay {
  background: rgba(255, 255, 255, 0.6);
  border: 1px dashed black;
  transition-property: top, left, right, bottom;
  transition-duration: 150ms;
  transition-timing-function: ease;
}
`;

  export const menu = css`
/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

/* <DEPRECATED> */
.p-Menu, /* </DEPRECATED> */
.lm-Menu {
  padding: 3px 0px;
  background: white;
  color: rgba(0, 0, 0, 0.87);
  border: 1px solid #c0c0c0;
  font: 12px Helvetica, Arial, sans-serif;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
}

/* <DEPRECATED> */
.p-Menu-item.p-mod-active, /* </DEPRECATED> */
.lm-Menu-item.lm-mod-active {
  background: #e5e5e5;
}

/* <DEPRECATED> */
.p-Menu-item.p-mod-disabled, /* </DEPRECATED> */
.lm-Menu-item.lm-mod-disabled {
  color: rgba(0, 0, 0, 0.25);
}

/* <DEPRECATED> */
.p-Menu-itemIcon, /* </DEPRECATED> */
.lm-Menu-itemIcon {
  width: 21px;
  padding: 4px 2px;
}

/* <DEPRECATED> */
.p-Menu-itemLabel, /* </DEPRECATED> */
.lm-Menu-itemLabel {
  padding: 4px 35px 4px 2px;
}

/* <DEPRECATED> */
.p-Menu-itemMnemonic, /* </DEPRECATED> */
.lm-Menu-itemMnemonic {
  text-decoration: underline;
}

/* <DEPRECATED> */
.p-Menu-itemShortcut, /* </DEPRECATED> */
.lm-Menu-itemShortcut {
  padding: 4px 0px;
}

/* <DEPRECATED> */
.p-Menu-itemSubmenuIcon, /* </DEPRECATED> */
.lm-Menu-itemSubmenuIcon {
  width: 16px;
  padding: 4px 0px;
}

/* <DEPRECATED> */
.p-Menu-item[data-type='separator'] > div,
/* </DEPRECATED> */
.lm-Menu-item[data-type='separator'] > div {
  padding: 0;
  height: 9px;
}

/* <DEPRECATED> */
.p-Menu-item[data-type='separator'] > div::after,
/* </DEPRECATED> */
.lm-Menu-item[data-type='separator'] > div::after {
  content: '';
  display: block;
  position: relative;
  top: 4px;
  border-top: 1px solid #dddddd;
}

/* <DEPRECATED> */
.p-Menu-itemIcon::before,
.p-Menu-itemSubmenuIcon::before,
/* </DEPRECATED> */
.lm-Menu-itemIcon::before,
.lm-Menu-itemSubmenuIcon::before {
  font-family: FontAwesome;
}

/* <DEPRECATED> */
.p-Menu-item.lm-mod-toggled > .p-Menu-itemIcon::before,
/* </DEPRECATED> */
.lm-Menu-item.lm-mod-toggled > .lm-Menu-itemIcon::before {
  content: '\f00c';
}

/* <DEPRECATED> */
.p-Menu-item[data-type='submenu'] > .p-Menu-itemSubmenuIcon::before,
/* </DEPRECATED> */
.lm-Menu-item[data-type='submenu'] > .lm-Menu-itemSubmenuIcon::before {
  content: '\f0da';
}
`;

  export const menubar = css`
/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

/* <DEPRECATED> */
.p-MenuBar, /* </DEPRECATED> */
.lm-MenuBar {
  padding-left: 5px;
  background: #fafafa;
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px solid #dddddd;
  font: 13px Helvetica, Arial, sans-serif;
}

/* <DEPRECATED> */
.p-MenuBar-menu, /* </DEPRECATED> */
.lm-MenuBar-menu {
  transform: translateY(-1px);
}

/* <DEPRECATED> */
.p-MenuBar-item, /* </DEPRECATED> */
.lm-MenuBar-item {
  padding: 4px 8px;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
}

/* <DEPRECATED> */
.p-MenuBar-item.p-mod-active, /* </DEPRECATED> */
.lm-MenuBar-item.lm-mod-active {
  background: #e5e5e5;
}

/* <DEPRECATED> */
.p-MenuBar.p-mod-active .p-MenuBar-item.p-mod-active,
/* </DEPRECATED> */
.lm-MenuBar.lm-mod-active .lm-MenuBar-item.lm-mod-active {
  z-index: 10001;
  background: white;
  border-left: 1px solid #c0c0c0;
  border-right: 1px solid #c0c0c0;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
}
`;

  export const scrollbar = css`
/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

/* <DEPRECATED> */
.p-ScrollBar[data-orientation='horizontal'],
/* </DEPRECATED> */
.lm-ScrollBar[data-orientation='horizontal'] {
  min-height: 16px;
  max-height: 16px;
  min-width: 45px;
  border-top: 1px solid #a0a0a0;
}

/* <DEPRECATED> */
.p-ScrollBar[data-orientation='vertical'],
/* </DEPRECATED> */
.lm-ScrollBar[data-orientation='vertical'] {
  min-width: 16px;
  max-width: 16px;
  min-height: 45px;
  border-left: 1px solid #a0a0a0;
}

/* <DEPRECATED> */
.p-ScrollBar-button, /* </DEPRECATED> */
.lm-ScrollBar-button {
  background-color: #f0f0f0;
  background-position: center center;
  min-height: 15px;
  max-height: 15px;
  min-width: 15px;
  max-width: 15px;
}

/* <DEPRECATED> */
.p-ScrollBar-button:hover, /* </DEPRECATED> */
.lm-ScrollBar-button:hover {
  background-color: #dadada;
}

/* <DEPRECATED> */
.p-ScrollBar-button.p-mod-active, /* </DEPRECATED> */
.lm-ScrollBar-button.lm-mod-active {
  background-color: #cdcdcd;
}

/* <DEPRECATED> */
.p-ScrollBar-track, /* </DEPRECATED> */
.lm-ScrollBar-track {
  background: #f0f0f0;
}

/* <DEPRECATED> */
.p-ScrollBar-thumb, /* </DEPRECATED> */
.lm-ScrollBar-thumb {
  background: #cdcdcd;
}

/* <DEPRECATED> */
.p-ScrollBar-thumb:hover, /* </DEPRECATED> */
.lm-ScrollBar-thumb:hover {
  background: #bababa;
}

/* <DEPRECATED> */
.p-ScrollBar-thumb.lm-mod-active, /* </DEPRECATED> */
.lm-ScrollBar-thumb.lm-mod-active {
  background: #a0a0a0;
}

/* <DEPRECATED> */
.p-ScrollBar[data-orientation='horizontal'] .p-ScrollBar-thumb,
/* </DEPRECATED> */
.lm-ScrollBar[data-orientation='horizontal'] .lm-ScrollBar-thumb {
  height: 100%;
  min-width: 15px;
  border-left: 1px solid #a0a0a0;
  border-right: 1px solid #a0a0a0;
}

/* <DEPRECATED> */
.p-ScrollBar[data-orientation='vertical'] .p-ScrollBar-thumb,
/* </DEPRECATED> */
.lm-ScrollBar[data-orientation='vertical'] .lm-ScrollBar-thumb {
  width: 100%;
  min-height: 15px;
  border-top: 1px solid #a0a0a0;
  border-bottom: 1px solid #a0a0a0;
}

/* <DEPRECATED> */
.p-ScrollBar[data-orientation='horizontal'] .p-ScrollBar-button[data-action='decrement'],
/* </DEPRECATED> */
.lm-ScrollBar[data-orientation='horizontal'] .lm-ScrollBar-button[data-action='decrement'] {
  background-image: url(../images/caretleft.png);
}

/* <DEPRECATED> */
.p-ScrollBar[data-orientation='horizontal'] .p-ScrollBar-button[data-action='increment'],
/* </DEPRECATED> */
.lm-ScrollBar[data-orientation='horizontal'] .lm-ScrollBar-button[data-action='increment'] {
  background-image: url(../images/caretright.png);
}

/* <DEPRECATED> */
.p-ScrollBar[data-orientation='vertical'] .p-ScrollBar-button[data-action='decrement'],
/* </DEPRECATED> */
.lm-ScrollBar[data-orientation='vertical'] .lm-ScrollBar-button[data-action='decrement'] {
  background-image: url(../images/caretup.png);
}

/* <DEPRECATED> */
.p-ScrollBar[data-orientation='vertical'] .p-ScrollBar-button[data-action='increment'],
/* </DEPRECATED> */
.lm-ScrollBar[data-orientation='vertical'] .lm-ScrollBar-button[data-action='increment'] {
  background-image: url(../images/caretdown.png);
}
`;

  export const tabbar = css`
/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

/* <DEPRECATED> */
.p-TabBar, /* </DEPRECATED> */
.lm-TabBar {
  min-height: 24px;
  max-height: 24px;
}

/* <DEPRECATED> */
.p-TabBar-content, /* </DEPRECATED> */
.lm-TabBar-content {
  min-width: 0;
  min-height: 0;
  align-items: flex-end;
  border-bottom: 1px solid #c0c0c0;
}

/* <DEPRECATED> */
.p-TabBar-tab, /* </DEPRECATED> */
.lm-TabBar-tab {
  padding: 0px 10px;
  background: #e5e5e5;
  border: 1px solid #c0c0c0;
  border-bottom: none;
  font: 12px Helvetica, Arial, sans-serif;
  flex: 0 1 125px;
  min-height: 20px;
  max-height: 20px;
  min-width: 35px;
  margin-left: -1px;
  line-height: 20px;
}

.lm-TabBar-tabLabel .lm-TabBar-tabInput {
  padding: 0px;
  border: 0px;
  font: 12px Helvetica, Arial, sans-serif;
}

/* <DEPRECATED> */
.p-TabBar-tab.p-mod-current, /* </DEPRECATED> */
.lm-TabBar-tab.lm-mod-current {
  background: white;
}

/* <DEPRECATED> */
.p-TabBar-tab:hover:not(.p-mod-current), /* </DEPRECATED> */
.lm-TabBar-tab:hover:not(.lm-mod-current) {
  background: #f0f0f0;
}

/* <DEPRECATED> */
.p-TabBar-tab:first-child, /* </DEPRECATED> */
.lm-TabBar-tab:first-child {
  margin-left: 0;
}

/* <DEPRECATED> */
.p-TabBar-tab.p-mod-current, /* </DEPRECATED> */
.lm-TabBar-tab.lm-mod-current {
  min-height: 23px;
  max-height: 23px;
  transform: translateY(1px);
}

/* <DEPRECATED> */
.p-TabBar-tabIcon,
.p-TabBar-tabLabel,
.p-TabBar-tabCloseIcon,
/* </DEPRECATED> */
.lm-TabBar-tabIcon,
.lm-TabBar-tabLabel,
.lm-TabBar-tabCloseIcon {
  display: inline-block;
}

/* <DEPRECATED> */
.p-TabBar-tab.p-mod-closable > .p-TabBar-tabCloseIcon,
/* </DEPRECATED> */
.lm-TabBar-tab.lm-mod-closable > .lm-TabBar-tabCloseIcon {
  margin-left: 4px;
}

.lm-TabBar .lm-TabBar-addButton {
  padding: 0px 6px;
  border-bottom: 1px solid #c0c0c0;
}

/* <DEPRECATED> */
.p-TabBar-tab.p-mod-closable > .p-TabBar-tabCloseIcon:before,
/* </DEPRECATED> */
.lm-TabBar-tab.lm-mod-closable > .lm-TabBar-tabCloseIcon:before {
  // content: '\f00d';
  // font-family: FontAwesome;
  content: 'x';
  font-weight: bold
}

.lm-TabBar .lm-TabBar-addButton:before {
  content: '\f067';
  font-family: FontAwesome;
}

/* <DEPRECATED> */
.p-TabBar-tab.p-mod-drag-image,
/* </DEPRECATED> */
.lm-TabBar-tab.lm-mod-drag-image {
  min-height: 23px;
  max-height: 23px;
  min-width: 125px;
  border: none;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  transform: translateX(-40%) translateY(-58%);
}
`;

  export const all = css`
${accordionpanel}
${commandpalette}
${datagrid}
${dockpanel}
${menu}
${menubar}
${scrollbar}
${tabbar}
`;
}

