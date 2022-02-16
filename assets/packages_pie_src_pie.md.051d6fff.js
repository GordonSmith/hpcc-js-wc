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
`)])],-1),f=s('<div class="tip custom-block"><p class="custom-block-title">TIP</p><p>See <a href="./../../../README.html">Getting Started</a> for details on how to include @hpcc-js/web-components in your application</p></div><h2 id="attributes" tabindex="-1">Attributes <a class="header-anchor" href="#attributes" aria-hidden="true">#</a></h2><h3 id="font-name" tabindex="-1"><code>font_name</code> <a class="header-anchor" href="#font-name" aria-hidden="true">#</a></h3><p><i>Name of label font family</i></p><p><strong>Type:</strong> <code>string</code></p><p><strong>Default Value:</strong> &quot;Verdana&quot;</p><h3 id="inner-radius" tabindex="-1"><code>inner_radius</code> <a class="header-anchor" href="#inner-radius" aria-hidden="true">#</a></h3><p><i>Inner radius of the pie chart. A larger value will make the pie chart appear as a donut chart.</i></p><p><strong>Type:</strong> <code>number</code></p><p><strong>Default Value:</strong> 2</p><h3 id="label-height" tabindex="-1"><code>label_height</code> <a class="header-anchor" href="#label-height" aria-hidden="true">#</a></h3><p><i>Label pixel height. Used to position the labels.</i></p><p><strong>Type:</strong> <code>number</code></p><p><strong>Default Value:</strong> 12</p><h3 id="min-outer-radius" tabindex="-1"><code>min_outer_radius</code> <a class="header-anchor" href="#min-outer-radius" aria-hidden="true">#</a></h3><p><i>The minimum outer radius. In general the pie chart will expand to fill the available space.</i></p><p><strong>Type:</strong> <code>number</code></p><p><strong>Default Value:</strong> 20</p><h3 id="series-percentage-format" tabindex="-1"><code>series_percentage_format</code> <a class="header-anchor" href="#series-percentage-format" aria-hidden="true">#</a></h3><p><i>Percentage format (when visible)</i></p><p><strong>Type:</strong> <code>string</code></p><p><strong>Default Value:</strong> &quot;,.0f&quot;</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Internally the format string uses <code>d3.format</code> to format the percentage. See <a href="https://github.com/d3/d3-format#locale_format" target="_blank" rel="noopener noreferrer">https://github.com/d3/d3-format#locale_format</a> for details.</p></div><h3 id="series-value-format" tabindex="-1"><code>series_value_format</code> <a class="header-anchor" href="#series-value-format" aria-hidden="true">#</a></h3><p><i>Value format (when visible)</i></p><p><strong>Type:</strong> <code>string</code></p><p><strong>Default Value:</strong> &quot;,.0f&quot;</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Internally the format string uses <code>d3.format</code> to format the value. See <a href="https://github.com/d3/d3-format#locale_format" target="_blank" rel="noopener noreferrer">https://github.com/d3/d3-format#locale_format</a> for details.</p></div><h3 id="show-labels" tabindex="-1"><code>show_labels</code> <a class="header-anchor" href="#show-labels" aria-hidden="true">#</a></h3><p><i>Show labels for each slice</i></p><p><strong>Type:</strong> <code>boolean</code></p><p><strong>Default Value:</strong> true</p><h3 id="show-series-percentage" tabindex="-1"><code>show_series_percentage</code> <a class="header-anchor" href="#show-series-percentage" aria-hidden="true">#</a></h3><p><i>Show value as a percentage for each slice</i></p><p><strong>Type:</strong> <code>boolean</code></p><p><strong>Default Value:</strong> false</p><h3 id="show-series-value" tabindex="-1"><code>show_series_value</code> <a class="header-anchor" href="#show-series-value" aria-hidden="true">#</a></h3><p><i>Show value for each slice</i></p><p><strong>Type:</strong> <code>boolean</code></p><p><strong>Default Value:</strong> false</p><h3 id="start-angle" tabindex="-1"><code>start_angle</code> <a class="header-anchor" href="#start-angle" aria-hidden="true">#</a></h3><p><i>The starting position for the first slice. This is used to rotate the pie chart.</i></p><p><strong>Type:</strong> <code>number</code></p><p><strong>Default Value:</strong> 0</p><h2 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties" aria-hidden="true">#</a></h2><h3 id="columns" tabindex="-1"><code>columns</code> <a class="header-anchor" href="#columns" aria-hidden="true">#</a></h3><p><i>&quot;Column&quot; labels for the data. Used to describe the data content</i></p><p><strong>Type:</strong> <code>Columns</code></p><p><strong>Default Value:</strong> [&quot;Label&quot;, &quot;Value&quot;]</p><h3 id="data" tabindex="-1"><code>data</code> <a class="header-anchor" href="#data" aria-hidden="true">#</a></h3><p><i>The data content for the pie chart.</i></p><p><strong>Type:</strong> <code>Data</code></p><p><strong>Default Value:</strong> []</p><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-hidden="true">#</a></h2><h2 id="more-examples" tabindex="-1">More Examples <a class="header-anchor" href="#more-examples" aria-hidden="true">#</a></h2><h3 id="start-angle-1" tabindex="-1">Start Angle <a class="header-anchor" href="#start-angle-1" aria-hidden="true">#</a></h3><p><strong>tag</strong>: <code>&lt;hpcc-pie start_angle=${i}&gt;</code></p>',57),m=e("hpcc-preview",{preview_border:"0px",style:{width:"100%",height:"400px"}},[e("pre",null,[e("code",null,`<hpcc-splitpanel style="width:100%;height:100%">
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
`)])],-1),_=s('<h2 id="credits" tabindex="-1">Credits <a class="header-anchor" href="#credits" aria-hidden="true">#</a></h2><h3 id="d3" tabindex="-1">d3 <a class="header-anchor" href="#d3" aria-hidden="true">#</a></h3><p><em>D3 (or D3.js) is a JavaScript library for visualizing data using web standards. D3 helps you bring data to life using SVG, Canvas and HTML. D3 combines powerful visualization and interaction techniques with a data-driven approach to DOM manipulation, giving you the full capabilities of modern browsers and the freedom to design the right visual interface for your data.</em></p><ul><li><a href="https://d3js.org/" target="_blank" rel="noopener noreferrer">Home Page</a></li><li><a href="https://github.com/d3/d3" target="_blank" rel="noopener noreferrer">GitHub</a></li></ul>',4);function b(v,w,y,x,T,S){const t=l("ClientOnly");return d(),n("div",null,[c,p,u,a(t,null,{default:r(()=>[g]),_:1}),f,a(t,null,{default:r(()=>[m]),_:1}),_])}var k=o(h,[["render",b]]);export{D as __pageData,k as default};
