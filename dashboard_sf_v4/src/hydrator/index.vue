<template>
  <div class="bg-[#f0f2f5] dark:bg-zinc-900 min-h-screen flex md:flex-row flex-col md:gap-6 md:p-6">
    <SideBar v-show="set_page === 'DASHBOARD'" />
    <Fragment v-show="set_page === 'DASHBOARD'" />
    <Message  v-show="set_page === 'MESSAGE'"/>
  </div>
</template>

<script lang="ts" setup>
  import type { _p_TYP, _$p_TYP } from "../shared/types";
  import SideBar from "./src/components/SideBar.vue"
  import Fragment from "./src/components/Fragment.vue"
  import Message from "./src/pages/Message.vue"

  const {_p,_$p} = defineProps<{
      _p:_p_TYP,
      _$p:_$p_TYP,
  }>();
  
  import { usePages } from './src/composables/usePages.ts';
  const { set_page } = usePages();
  
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
</script>
