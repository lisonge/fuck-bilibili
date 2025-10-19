<script setup lang="ts">
import type { StyleValue } from 'vue';
import {
  onMounted,
  onScopeDispose,
  onUnmounted,
  shallowRef,
  watchEffect,
} from 'vue';
import { attachStyle } from '../style';

type IFalse<T> = T | false | null | undefined;
type IFunc<T> = T | (() => T);
const props = defineProps<{
  to: IFunc<IFalse<string | HTMLElement>>;
  style?: StyleValue;
}>();
let alive = true;
onScopeDispose(() => (alive = false));

const target = shallowRef<[HTMLElement, HTMLElement, ShadowRoot]>();
const applyStyleValue = (t: HTMLElement, s: StyleValue, depth = 0) => {
  if (!s) {
    if (depth === 0) {
      t.style = '';
    }
  } else if (typeof s === 'string') {
    t.style = s;
  } else if (s instanceof Array) {
    s.forEach((s2) => {
      applyStyleValue(t, s2, depth + 1);
    });
  } else {
    Object.entries(s).forEach(([name, value]) => {
      Reflect.set(t.style, name, value);
    });
  }
};
watchEffect(() => {
  const t = target.value?.[1];
  if (!t) return;
  applyStyleValue(t, props.style);
});
const removeDom = () => {
  if (!target.value) return;
  const [t, c] = target.value;
  t.removeChild(c);
  target.value = undefined;
};
const addDom = (t: HTMLElement) => {
  removeDom();
  const c = document.createElement('div');
  const shadowRoot = t.appendChild(c).attachShadow({ mode: 'open' });
  attachStyle(shadowRoot);
  target.value = [t, c, shadowRoot];
};
const selector = (): HTMLElement | undefined => {
  const v = props.to;
  let s: string | HTMLElement = '';
  if (typeof v === 'function') {
    s = v() || '';
  } else {
    s = v || '';
  }
  if (!s) return;
  if (s instanceof HTMLElement) return s;
  return document.querySelector<HTMLElement>(s) ?? undefined;
};
onMounted(async () => {
  while (alive) {
    const t = selector();
    if (t && t !== target.value?.[0]) {
      addDom(t);
    } else if (!t) {
      removeDom();
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
});
onUnmounted(removeDom);
</script>
<template>
  <Teleport v-if="target" :to="target[2]">
    <slot></slot>
  </Teleport>
</template>
