<template>
    <div class="flex flex-col gap-2 h-screen">
      <!-- Message header -->
      <div class="bg-white dark:bg-zinc-800 dark:text-white rounded-b-2xl  flex items-center justify-between gap-3 px-4 md:p-0">
        <div @click="set_page='DASHBOARD'" class="h-12 flex flex-row flex-1 items-center  gap-2 p-1 md:p-0 md:rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <p class="font-semibold">Message</p>
        </div>
        
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 md:hidden block dark:text-white">
          <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 0 0-.266.112L8.78 21.53A.75.75 0 0 1 7.5 21v-3.955a48.842 48.842 0 0 1-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clip-rule="evenodd" />
        </svg>

  
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 md:hidden block dark:text-white">
          <path v-show="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          <path v-show="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>
      
      <!--Message main -->
      <div class="flex-1 rounded-t-2xl bg-white dark:bg-zinc-800 p-4">
        <div class="bg-zinc-100 dark:bg-zinc-700 rounded-xl p-4 mt-4 flex flex-col gap-1">
          <p class="dark:text-white font-semibold leading-none">Looking for a gift? 😍</p>
          <p class="text-zinc-500 dark:text-zinc-400 text-xs">we found it! Ozon certificated</p>
          <p class="text-blue-500 text-xs cursor-pointer">learn more</p>
        </div>
        
        <!--notifications-->
        <div class="flex items-start gap-3 mt-4 bg-blue-50 rounded-2xl p-2">
          <img src="/noti.png" alt="notification icon" 
            class="w-14 h-14 rounded-lg bg-blue-200 p-2"
          >
          <div>
            <p class="font-semibold leading-none">Safety</p>
            <p class="text-zinc-500 dark:text-zinc-400 text-xs">login from new device</p>
          </div>
        </div>
        
        <div class="flex items-start gap-3 mt-4 bg-green-50 rounded-2xl p-2">
          <img src="/noti.png" alt="notification icon" 
            class="w-14 h-14 rounded-lg bg-green-200 p-2"
          >
          <div>
            <p class="font-semibold leading-none">Safety</p>
            <p class="text-zinc-500 dark:text-zinc-400 text-xs">login from new device</p>
          </div>
        </div>
        
        <div class="flex items-start gap-3 mt-4 bg-violet-50 rounded-2xl p-2">
          <img src="/noti.png" alt="notification icon" 
            class="w-14 h-14 rounded-lg bg-violet-200 p-2"
          >
          <div>
            <p class="font-semibold leading-none">Safety</p>
            <p class="text-zinc-500 dark:text-zinc-400 text-xs">login from new device</p>
          </div>
        </div>
        
      </div>
    </div>
</template>

<script setup>
  import { usePages } from '../composables/usePages.ts';
  const { set_page } = usePages();
</script>