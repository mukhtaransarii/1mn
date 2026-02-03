<template>
  <Button 
   :label="_$p.data.curr.data.label" 
   :size="_$p.data.curr.data.size" 
   :style="_$p.data.curr.data.style"  
   @click="() => { 
      _p.f.call('msg', { 
        type: 'click',
        custom: {},
        _p: _p,
        _$p: _$p,
      }); 
    }"
  />
</template>


<script lang="ts" setup>
import type { _p_TYP, _$p_TYP } from "../shared/types";

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

_p.f.listen('msg', async (_$) =>{
    console.log(_$);
    if(_$.type === 'click'){
        alert("Button clicked!");

    }

});

import Button from 'primevue/button';
</script>
