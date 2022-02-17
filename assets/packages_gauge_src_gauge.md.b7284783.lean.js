import{_ as a,c as i,e as r,w as n,b as e,d as t,a as l,r as s,o as c}from"./app.6a85d98e.js";const x='{"title":"Gauge","description":"","frontmatter":{},"headers":[{"level":2,"title":"Attributes","slug":"attributes"},{"level":3,"title":"empty_color","slug":"empty-color"},{"level":3,"title":"show_tick","slug":"show-tick"},{"level":3,"title":"tick_color","slug":"tick-color"},{"level":3,"title":"tick_value_description","slug":"tick-value-description"},{"level":3,"title":"tick_value","slug":"tick-value"},{"level":3,"title":"title_description","slug":"title-description"},{"level":3,"title":"title","slug":"title"},{"level":3,"title":"tooltip","slug":"tooltip"},{"level":3,"title":"value_description","slug":"value-description"},{"level":3,"title":"value","slug":"value"},{"level":2,"title":"Properties","slug":"properties"},{"level":3,"title":"color_domain","slug":"color-domain"},{"level":3,"title":"color_range","slug":"color-range"},{"level":2,"title":"Events","slug":"events"},{"level":2,"title":"Credits","slug":"credits"},{"level":3,"title":"d3","slug":"d3"},{"level":3,"title":"d3-svg-annotation","slug":"d3-svg-annotation"}],"relativePath":"packages/gauge/src/gauge.md"}',d={},h=e("h1",{id:"gauge",tabindex:"-1"},[t("Gauge "),e("a",{class:"header-anchor",href:"#gauge","aria-hidden":"true"},"#")],-1),u=e("div",{class:"warning custom-block"},[e("p",{class:"custom-block-title"},"WARNING"),e("p",null,"This is currently a POC repository and has not been released to the npmjs repository.")],-1),p=e("p",null,[e("strong",null,"tag"),t(": "),e("code",null,"<hpcc-gauge>")],-1),g=e("hpcc-preview",{preview_border:"0px",preview_height_ratio:"0.33",style:{width:"100%",height:"400px"}},[e("pre",null,[e("code",null,`<hpcc-splitpanel style="width:100%;height:100%">
  <hpcc-gauge show_tick title="G-01" title_description="Gauge 01" style="width:100%;min-width:48px;height:100%">
  </hpcc-gauge>
  <hpcc-gauge title="G-02" style="width:100%;min-width:48px;height:100%">
  </hpcc-gauge>
  <hpcc-gauge show_tick title="G-03" style="width:100%;min-width:48px;height:100%">
  </hpcc-gauge>
  <hpcc-gauge title="G-04" style="width:100%;min-width:48px;height:100%">
  </hpcc-gauge>
</hpcc-splitpanel>
<script>
    for (const gauge of document.querySelectorAll("hpcc-gauge")) {
        gauge.value = Math.random();
        gauge.tick_value = Math.random();
    }
<\/script>
`)])],-1),v=l("",59);function f(_,m,b,y,q,k){const o=s("ClientOnly");return c(),i("div",null,[h,u,p,r(o,null,{default:n(()=>[g]),_:1}),v])}var T=a(d,[["render",f]]);export{x as __pageData,T as default};
