<template>
  <main class="flex-1">
    <!-- mobile fragment header only -->
      <div class="bg-white dark:bg-zinc-800 dark:text-white rounded-b-2xl  flex items-center justify-between gap-3 px-4 mb-4"
       :class="setMenu.value === 'Home' ? 'hidden': 'block md:hidden'"
      >
        <div @click="setMenu={ label: 'Home', value: 'Home', type: 'Fragments' }" class="h-12 flex flex-row flex-1 items-center  gap-2 p-1 md:p-0 md:rounded-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <p class="font-semibold">Back to home</p>
        </div>
        
        <!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 md:hidden block dark:text-white">-->
        <!--  <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 0 0-.266.112L8.78 21.53A.75.75 0 0 1 7.5 21v-3.955a48.842 48.842 0 0 1-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clip-rule="evenodd" />-->
        <!--</svg>-->

        <!--<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 md:hidden block dark:text-white">-->
        <!--  <path v-show="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />-->
        <!--  <path v-show="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />-->
        <!--</svg>-->
      </div>
    
    <component :is="currentFragment" />
  </main>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useSideBar } from '../composables/useSideBar'

const { setMenu } = useSideBar();

// Auto-import all fragments in ./fragments folder
const modules = import.meta.glob('./fragments/*.vue') as Record<string, () => Promise<{ default: any }>>

const currentFragment = shallowRef<any>(null)

const loadFragment = async () => {
  if (setMenu.value.type === 'Fragments') {
    const path = `./fragments/${setMenu.value.value}.vue`
    currentFragment.value = path in modules
      ? (await modules[path]()).default
      : (await modules['./fragments/Home.vue']()).default
  } else {
    currentFragment.value = (await modules['./fragments/Home.vue']()).default
  }
}

// Initial load
loadFragment()

// Reactive reload when setMenu changes
watch(setMenu, loadFragment)
</script>
