<template>
  <Select 
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

  const {_p,_$p} = defineProps<{
      _p:_p_TYP,
      _$p:_$p_TYP,
  }>();


  import { ref, watch } from "vue";
  import Select from 'primevue/select';
  const select = ref();

  // watch for changes to the selected value
  watch(select, (newVal) => {
    if(newVal) {
      _p.f.call('msg', {
        type: 'select:value',
        custom: { selectedValue: newVal },
        _p,
        _$p
      });
    }
  });

// optional: listen to messages
// _p.f.listen('msg', async (_$) =>{
//   if(_$.type === 'select:value'){
//     console.log("Received select:value event:", select.value);
//   }
// });

</script>
