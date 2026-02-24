<template>
   <div v-if="page_state === 'ORDER_PAGE'">
     <Order v-bind="{
      __p:_$p,
      _p:_p
     }" />
   </div>
   
   <div v-if="page_state === 'PURCHASED_PAGE'">
     <Purchased v-bind="{
      __p:_$p,
      _p:_p
     }" />
   </div>
</template>

<script lang="ts" setup>
  import { onMounted } from "vue";
  import type { _p_TYP, _$p_TYP } from "../shared/types";
  import Order from "./src/pages/Order.vue";
  import Purchased from "./src/pages/Purchased.vue";
  
  const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
  }>();
  
  // theme listener 
  (async () => {
      _p.f.listen("msg", async (_$) => {    
      if(_$.type === 'theme:change'){
        const theme = _$.custom?.theme;
        if (theme === 'dark' ) document.documentElement.classList.add('dark' );
        else document.documentElement.classList.remove('dark');
      }
      })
  })();
  
  // Calling order
  import { useOrder } from "./src/composable/useOrder";
  import { useVar } from "./src/composable/useVar";
  const {_$p:_set_$p} = useVar();
  //update..
  _set_$p.value = _$p;
  const { getAllOrder, order, page_state, getDeliveredOrder, deliveredOrder} = useOrder();
  

  onMounted(async() => {
    await getAllOrder();
    await getDeliveredOrder();

    console.log('orders :', order.value)
    console.log('delivered orders :', deliveredOrder.value)
  })

</script>