<template>
  <Password
    v-model="passwordValue"
    :placeholder="_$p.data.curr.data.placeholder"
    :toggleMask="_$p.data.curr.data.toggleMask"
    :feedback="_$p.data.curr.data.feedback"
    class="w-full md:w-56"
    :style="_$p.data.curr.data.style"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import Password from 'primevue/password';
import type { _p_TYP, _$p_TYP } from "../shared/types";

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

// reactive variable
const passwordValue = ref("");

// watch for changes
watch(passwordValue, (newVal) => {
  _p.f.call('msg', {
    type: 'password:value',
    custom: { passwordValue: newVal }, // matches reactive variable
    _p,
    _$p
  });
});
</script>
