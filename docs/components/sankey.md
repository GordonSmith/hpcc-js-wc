# Sankey

<ClientOnly>
  <p>Top</p>
  <hpcc-sankey id="test" width="100%" height="200" ></hpcc-sankey>
  <p>Bottom</p>
</ClientOnly>


This is my **first vitepress document**!

```jsx
function HelloDocusaurus() {
    return (
        <h1>Hello, Docusaurus!</h1>
    )
}
```

:::tip My tip

Use this awesome feature option

:::

:::danger Take care

This action is dangerous
  
:::

Test:

<script>
export default {
  mounted() {
    import('../../src/sankey').then(()=>{
      document.getElementById('test').links = [{ "source": "Agricultural waste", "target": "Bio-conversion", "value": 124.729 }];
    });
  }
}
</script>
