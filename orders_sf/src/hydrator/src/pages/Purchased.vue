<template>
    <div class="flex flex-col   bg-[#f0f2f5] dark:bg-zinc-900    md:px-6 min-h-screen">
      <!--Header-->
      <div class="flex flex-col bg-white dark:bg-zinc-800 md:dark:bg-transparent md:bg-transparent md:pb-10 pt-2 px-4 md:px-0">
        <!-- Mobile back button -->
        <div @click="page_state='ORDER_PAGE'" class="flex items-center gap-2 md:hidden">
          <button class="p-1 -ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-zinc-900 dark:text-zinc-100">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 class="text-lg text-zinc-900 dark:text-zinc-100">Purchased</h1>
        </div>
        
        <!-- Desktop back only -->
        <h1 class="hidden md:block text-3xl font-semibold text-zinc-900 dark:text-zinc-100">Purchased</h1>

        <button @click="page_state='ORDER_PAGE'" class="cursor-pointer hidden md:flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 group-hover:-translate-x-0.5 transition-transform">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span class="text-sm font-light">Back to Orders</span>
        </button>
      </div>
  
       <div class="flex flex-col md:flex-row gap-6">
         <PurchasedLeft   />
       </div>
    </div>
</template>

<script setup lang="ts">
  import type { _$p_TYP, _p_TYP } from '../../../shared/types';
  import PurchasedLeft from '../components/PurchasedLeft.vue'
  import { useOrder } from "../composable/useOrder";
  const { page_state } = useOrder();
</script>