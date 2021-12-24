import { css } from "../common/element";

export const TabBarCSS = css`

.lm-TabBar {
    display: flex;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.lm-TabBar[data-orientation='horizontal'] {
    flex-direction: row;
    align-items: flex-end;
}

.lm-TabBar[data-orientation='vertical'] {
    flex-direction: column;
    align-items: flex-end;
}

.lm-TabBar-content {
    margin: 0;
    padding: 0;
    display: flex;
    flex: 1 1 auto;
    list-style-type: none;
}

.lm-TabBar[data-orientation='horizontal'] > .lm-TabBar-content {
    flex-direction: row;
}

.lm-TabBar[data-orientation='vertical'] > .lm-TabBar-content {
    flex-direction: column;
}

.lm-TabBar-tab {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    overflow: hidden;
    touch-action: none; /* Disable native Drag/Drop */
}

.lm-TabBar-tabIcon,
.lm-TabBar-tabCloseIcon {
    flex: 0 0 auto;
}

.lm-TabBar-tabLabel {
    flex: 1 1 auto;
    overflow: hidden;
    white-space: nowrap;
}

.lm-TabBar-tabInput {
    user-select: all;
    width: 100%;
    box-sizing: border-box;
}

.lm-TabBar-tab.lm-mod-hidden {
    display: none !important;
}

.lm-TabBar-addButton.lm-mod-hidden {
    display: none !important;
}

.lm-TabBar.lm-mod-dragging .lm-TabBar-tab {
    position: relative;
}

.lm-TabBar.lm-mod-dragging[data-orientation='horizontal'] .lm-TabBar-tab {
    left: 0;
    transition: left 150ms ease;
}

.lm-TabBar.lm-mod-dragging[data-orientation='vertical'] .lm-TabBar-tab {
    top: 0;
    transition: top 150ms ease;
}

.lm-TabBar.lm-mod-dragging .lm-TabBar-tab.lm-mod-dragging {
    transition: none;
}

.lm-TabBar-tabLabel .lm-TabBar-tabInput {
    user-select: all;
    width: 100%;
    box-sizing: border-box;
    background: inherit;
}
`;

export const TabBarExtCSS = css`
.lm-TabBar {
    min-height: 24px;
    max-height: 24px;
}

.lm-TabBar-content {
    min-width: 0;
    min-height: 0;
    align-items: flex-end;
    border-bottom: 1px solid #c0c0c0;
}

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

.lm-TabBar-tab.lm-mod-current {
    background: white;
}

.lm-TabBar-tab:hover:not(.lm-mod-current) {
    background: #f0f0f0;
}

.lm-TabBar-tab:first-child {
    margin-left: 0;
}

.lm-TabBar-tab.lm-mod-current {
    min-height: 23px;
    max-height: 23px;
    transform: translateY(1px);
}

.lm-TabBar-tabIcon,
.lm-TabBar-tabLabel,
.lm-TabBar-tabCloseIcon {
    display: inline-block;
}

.lm-TabBar-tab.lm-mod-closable > .lm-TabBar-tabCloseIcon {
    margin-left: 4px;
}

.lm-TabBar .lm-TabBar-addButton {
    padding: 0px 6px;
    border-bottom: 1px solid #c0c0c0;
}

.lm-TabBar-tab.lm-mod-closable > .lm-TabBar-tabCloseIcon:before {
    content: '\f00d';
    font-family: FontAwesome;
}

.lm-TabBar .lm-TabBar-addButton:before {
    content: '\f067';
    font-family: FontAwesome;
}

.lm-TabBar-tab.lm-mod-drag-image {
    min-height: 23px;
    max-height: 23px;
    min-width: 125px;
    border: none;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    transform: translateX(-40%) translateY(-58%);
}
`;
