<template>
     <div class="flex flex-col    bg-[#f0f2f5] dark:bg-zinc-900    md:px-6 min-h-screen">
       <!--Header-->
       <div class="flex items-center bg-white dark:bg-zinc-800 md:dark:bg-transparent md:bg-transparent md:pb-10 pt-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="md:hidden ml-2 size-6 text-zinc-900 dark:text-zinc-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
         
          <h1 class="text-lg md:text-3xl md:font-semibold text-zinc-900 dark:text-zinc-100">Orders</h1>
       </div>
  
       <div class="flex flex-col md:flex-row gap-6">
        <OrderLeft  />
        <OrderRight   />
       </div>
     </div>
</template>

<script setup lang="ts">
  const {_p:_p,__p:_$p} = defineProps<{
    _p:_p_TYP,
    __p:_$p_TYP,
  }>();

  //alert(_$p.data.curr.data.api[`token`]);



import type { _$p_TYP, _p_TYP } from "../../../shared/types";
  import OrderLeft from "../components/OrderLeft.vue";
  import OrderRight from "../components/OrderRight.vue";
</script>