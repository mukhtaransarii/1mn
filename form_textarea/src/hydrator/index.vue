<template>
  <Textarea
    v-model="textareaValue"
    :placeholder="_$p.data.curr.data.placeholder"
    class="w-full md:w-56 border p-2 rounded"
    :rows="_$p.data.curr.data.rows ?? 4"
    :style="_$p.data.curr.data.style"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import Textarea from 'primevue/textarea';
import type { _p_TYP, _$p_TYP } from "../shared/types";

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

// reactive variable for textarea
const textareaValue = ref("");

// watch for changes to textarea value
watch(textareaValue, (newVal) => {
  _p.f.call('msg', {
    type: 'textarea:value',
    custom: { textareaValue: newVal },
    _p,
    _$p
  });
});
</script>
