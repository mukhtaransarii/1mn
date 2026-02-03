<template>
  <!-- AutoComplete input with dynamic suggestions -->
  <AutoComplete
    v-model="value"                         
    :suggestions="filteredOptions"          
    :placeholder="_$p.data.curr.data.placeholder"
    class="w-full md:w-56"
    :style="_$p.data.curr.data.style"
    @complete="searchOptions"               
  />
</template>

<script lang="ts" setup>
import type { _p_TYP, _$p_TYP } from "../shared/types";
import { ref, watch } from "vue";
import AutoComplete from 'primevue/autocomplete';

const { _p, _$p } = defineProps<{
  _p: _p_TYP,
  _$p: _$p_TYP,
}>();

const value = ref('');                      // current input / selected title
const filteredOptions = ref<string[]>([]);  // suggestion titles
const productMap = ref<Record<string, any>>({}); // title -> full product object

// Fires when a suggestion is selected (not on typing)
watch(value, (newVal) => {
  const product = productMap.value[newVal];
  if (product) {
    _p.f.call('msg', {
      type: 'autocomplete:select',
      custom: { selectedValue: product },   // send full product to engine
      _p,
      _$p
    });
  }
});

// Called on every keystroke to fetch suggestions
const searchOptions = async (e: any) => {
  const q = e.query.trim();
  if (!q) return;

  // DEV: log each query
  console.log('[AutoComplete query]', q);

  const api = _$p.data.curr.data.api;
  const res = await fetch(api.url, {
    method: api.method,
    headers: { 'Content-Type': 'application/json', ...api.headers },
    body: JSON.stringify({ ...api.body, q }) // send input as q
  });

  const json = await res.json();

  // Build suggestion list + lookup map
  productMap.value = {};
  filteredOptions.value = json.data.products.map((p: any) => {
    productMap.value[p.title] = p;           // keep full object
    return p.title;                          // show only title in UI
  });
};
</script>
