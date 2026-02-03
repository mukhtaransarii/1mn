<template>
  <MultiSelect
    v-model="select"
    :options="_$p.data.curr.data.options"
    :optionLabel="_$p.data.curr.data.optionLabel"
    :placeholder="_$p.data.curr.data.placeholder"
    class="w-full md:w-56"
    :style="_$p.data.curr.data.style"
  />
</template>

<script lang="ts" setup>
import type { _p_TYP, _$p_TYP } from "../shared/types";
import { ref, watch } from "vue";
import MultiSelect from 'primevue/multiselect';

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

// v-model should be an array for MultiSelect
const select = ref<any[]>([]);

// watch for changes to the selected value
watch(select, (newVal) => {
  if (newVal.length) {
    _p.f.call('msg', {
      type: 'multiselect:value',
      custom: { multiSelectedValue: newVal },
      _p,
      _$p
    });
  }
});

</script>
