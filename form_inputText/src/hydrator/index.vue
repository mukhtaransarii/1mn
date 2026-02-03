<template>
  <InputText
    v-model="inputTextValue"
    :placeholder="_$p.data.curr.data.placeholder"
    class="w-full md:w-56 border p-2 rounded"
    :style="_$p.data.curr.data.style"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import InputText from 'primevue/inputtext';
import type { _p_TYP, _$p_TYP } from "../shared/types";

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

// reactive variable for input text
const inputTextValue = ref("");

// watch for changes to input text
watch(inputTextValue, (newVal) => {
  _p.f.call('msg', {
    type: 'inputText:value',
    custom: { inputTextValue: newVal },
    _p,
    _$p
  });
});
</script>
