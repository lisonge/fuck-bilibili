<script lang="ts">
const modules: Record<string, { default: string }> = import.meta.glob(
  '../assets/svg/*.svg',
  {
    eager: true,
    query: 'raw',
  }
);

const svgIconMap = (() => {
  const domParser = new DOMParser();
  return Object.fromEntries(
    Object.entries(modules)
      .filter(([_, v]) => v.default.trim())
      .map(([k, v]) => [k.split('/').at(-1)!.split('.')[0], v.default])
      .map(([svgName, svgText]) => {
        const symbolEl = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'symbol'
        );
        const svgEl = domParser.parseFromString(
          svgText,
          'image/svg+xml'
        ).documentElement;
        Array.from(svgEl.attributes).forEach((attr) => {
          symbolEl.setAttributeNS(null, attr.name, attr.value);
        });
        symbolEl.innerHTML = svgEl.innerHTML;
        return [svgName, symbolEl];
      })
  );
})();
</script>
<script setup vapor lang="ts">
import { computed, shallowRef, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    name: string;
  }>(),
  {}
);

const svgEl = computed(() => svgIconMap[props.name]);
const actualEl = shallowRef<SVGSVGElement>();
watchEffect(() => {
  const s = svgEl.value;
  const a = actualEl.value;
  if (!s || !a) return;
  a.replaceChildren(...s.cloneNode(true).childNodes);
});
</script>
<template>
  <svg
    v-if="svgEl"
    class="SvgIcon"
    :name="name"
    :viewBox="svgEl.getAttributeNS(null, 'viewBox') || undefined"
    :fill="svgEl.getAttribute('fill') || undefined"
    ref="actualEl"
  ></svg>
</template>
