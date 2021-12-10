# Zoom

<script>
export default {
  mounted() {
    import('../../src');
  }
}
</script>

<ClientOnly>
<div style="border:1px solid var(--c-divider)">
<hpcc-zoom width="100%">
<p>!!!Drag and Zoom Me!!!</p>
</hpcc-zoom>
</div>
</ClientOnly>
