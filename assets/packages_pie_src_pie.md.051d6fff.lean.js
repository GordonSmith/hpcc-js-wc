import{_ as o,c as n,e as a,w as r,b as e,d as i,a as s,r as l,o as d}from"./app.6a85d98e.js";const D='{"title":"Pie","description":"","frontmatter":{},"headers":[{"level":2,"title":"Attributes","slug":"attributes"},{"level":3,"title":"font_name","slug":"font-name"},{"level":3,"title":"inner_radius","slug":"inner-radius"},{"level":3,"title":"label_height","slug":"label-height"},{"level":3,"title":"min_outer_radius","slug":"min-outer-radius"},{"level":3,"title":"series_percentage_format","slug":"series-percentage-format"},{"level":3,"title":"series_value_format","slug":"series-value-format"},{"level":3,"title":"show_labels","slug":"show-labels"},{"level":3,"title":"show_series_percentage","slug":"show-series-percentage"},{"level":3,"title":"show_series_value","slug":"show-series-value"},{"level":3,"title":"start_angle","slug":"start-angle"},{"level":2,"title":"Properties","slug":"properties"},{"level":3,"title":"columns","slug":"columns"},{"level":3,"title":"data","slug":"data"},{"level":2,"title":"Events","slug":"events"},{"level":2,"title":"More Examples","slug":"more-examples"},{"level":3,"title":"Start Angle","slug":"start-angle-1"},{"level":2,"title":"Credits","slug":"credits"},{"level":3,"title":"d3","slug":"d3"}],"relativePath":"packages/pie/src/pie.md"}',h={},c=e("h1",{id:"pie",tabindex:"-1"},[i("Pie "),e("a",{class:"header-anchor",href:"#pie","aria-hidden":"true"},"#")],-1),p=e("div",{class:"warning custom-block"},[e("p",{class:"custom-block-title"},"WARNING"),e("p",null,"This is currently a POC repository and has not been released to the npmjs repository.")],-1),u=e("p",null,[e("strong",null,"tag"),i(": "),e("code",null,"<hpcc-pie>")],-1),g=e("hpcc-preview",{preview_border:"0px",style:{width:"100%",height:"400px"}},[e("pre",null,[e("code",null,`<hpcc-splitpanel style="width:100%;height:100%">
  <hpcc-pie style="width:100%;min-width:48px;height:100%">
  </hpcc-pie>
  <hpcc-pie inner_radius=80 style="width:100%;min-width:48px;height:100%">
  </hpcc-pie>
</hpcc-splitpanel>
<script>
  for (const pie of document.querySelectorAll("hpcc-pie")) {
    pie.columns = ["Subject", "Score"];
    pie.data = [
      ["Math", 88],
      ["English", 72],
      ["Science", 60],
      ["History", 50],
      ["Geography", 40],
      ["Biology", 30],
      ["Physics", 20],
      ["Chemistry", 10]
    ];
  }
<\/script>
`)])],-1),f=s("",57),m=e("hpcc-preview",{preview_border:"0px",style:{width:"100%",height:"400px"}},[e("pre",null,[e("code",null,`<hpcc-splitpanel style="width:100%;height:100%">
  <hpcc-pie style="width:100%;min-width:48px;height:100%">
  </hpcc-pie>
  <hpcc-pie inner_radius=80 style="width:100%;min-width:48px;height:100%">
  </hpcc-pie>
</hpcc-splitpanel>
<script>
  const pies = document.querySelectorAll("hpcc-pie");
  for (const pie of pies) {
    pie.columns = ["Subject", "Score"];
    pie.data = [
      ["Math", 88],
      ["English", 72],
      ["Science", 60],
      ["History", 50],
      ["Geography", 40],
      ["Biology", 30],
      ["Physics", 20],
      ["Chemistry", 10]
    ];
  }
  let i = 0;
  setInterval(()=>{
    let j = 0;
    for (const pie of pies) {
      pie.setAttribute("start_angle", j % 2 === 0 ? i :-i);
      ++j;
    }
    i += 3;
  }, 150)
<\/script>
`)])],-1),_=s("",4);function b(v,w,y,x,T,S){const t=l("ClientOnly");return d(),n("div",null,[c,p,u,a(t,null,{default:r(()=>[g]),_:1}),f,a(t,null,{default:r(()=>[m]),_:1}),_])}var k=o(h,[["render",b]]);export{D as __pageData,k as default};
