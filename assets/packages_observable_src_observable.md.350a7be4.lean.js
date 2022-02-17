import{_ as l,c as i,e as a,w as t,b as e,d as s,a as o,r as n,o as h}from"./app.6a85d98e.js";const O='{"title":"Observable","description":"","frontmatter":{},"headers":[{"level":2,"title":"Attributes","slug":"attributes"},{"level":3,"title":"mode","slug":"mode"},{"level":3,"title":"show_errors","slug":"show-errors"},{"level":3,"title":"show_values","slug":"show-values"},{"level":2,"title":"Properties","slug":"properties"},{"level":3,"title":"plugins","slug":"plugins"},{"level":2,"title":"Events","slug":"events"},{"level":2,"title":"More Examples","slug":"more-examples"},{"level":3,"title":"Observable Markdown","slug":"observable-markdown"},{"level":2,"title":"Credits","slug":"credits"},{"level":3,"title":"@observablehq/runtime","slug":"observablehq-runtime"},{"level":3,"title":"@observablehq/parser","slug":"observablehq-parser"},{"level":3,"title":"@observablehq/stdlib","slug":"observablehq-stdlib"},{"level":3,"title":"@observablehq/inspector","slug":"observablehq-inspector"}],"relativePath":"packages/observable/src/observable.md"}',d={},b=e("h1",{id:"observable",tabindex:"-1"},[s("Observable "),e("a",{class:"header-anchor",href:"#observable","aria-hidden":"true"},"#")],-1),c=e("div",{class:"warning custom-block"},[e("p",{class:"custom-block-title"},"WARNING"),e("p",null,"This is currently a POC repository and has not been released to the npmjs repository.")],-1),p=e("p",null,[e("strong",null,"tag"),s(": "),e("code",null,"<hpcc-observable>")],-1),u=e("hpcc-preview",{style:{width:"100%",height:"800px"}},[e("pre",null,[e("code",null,`<hpcc-observable style="width:100%;height:100%">
  md\`# Confirmed Cases v Deaths (\${my_country}) - \${lastDate.toLocaleDateString("en-US", {dateStyle: "medium"})}\`

  chart;

  //  Dependencies
  my_country = "Germany";
  import { chart, lastDate } with { my_country as overrideLocation } from "@gordonsmith/irish-confirmed-cases-v-deaths";
</hpcc-observable>
`)])],-1),v=o("",24),m=e("hpcc-preview",{style:{width:"100%",height:"800px"}},[e("pre",null,[e("code",null,`<hpcc-observable mode="markdown" style="width:100%;height:100%">
  # Liquid Fun

  \`\`\`
  canvas;

  //  Dependencies
  import { canvas } from "@mbostock/liquidfun";
  \`\`\`
</hpcc-observable>
`)])],-1),g=o("",13);function _(f,w,q,y,k,x){const r=n("ClientOnly");return h(),i("div",null,[b,c,p,a(r,null,{default:t(()=>[u]),_:1}),v,a(r,null,{default:t(()=>[m]),_:1}),g])}var S=l(d,[["render",_]]);export{O as __pageData,S as default};
