<template>
   <div class="max-w-2xl mx-auto dark:bg-zinc-900"> <!-- temporary div to make contaniar -->
      
      <!-- Step 1: No addresses -->
      <div v-if="addresses.length >= 0 && !showForm">
       <div class="flex items-center justify-between my-4 bg-white dark:bg-zinc-800 p-2">
          <div>
            <p class="text-medium text-lg dark:text-white">Saved Addresses</p>
            <p class="text-xs text-gray-400">Address length: {{ addresses.length }}</p>
          </div>
          <button 
            @click="addAddress()" 
            class="font-medium text-violet-500 p-2 border border-black/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer"
            >
            + ADD NEW ADDRESS
          </button>       
        </div>
      </div>

      <!-- Step 2: Addresses exist -->
      <div v-if="addresses.length > 0 && !showForm">
        <AddressCard />
      </div>

      <!-- Step 3: Form -->
      <div v-if="showForm">
        <AddressForm />
      </div>

   </div>
</template>

<script lang="ts" setup>
  import { onMounted, watch } from 'vue'
  import type { _p_TYP, _$p_TYP } from "../shared/types";

  import AddressForm from './src/components/AddressForm.vue';
  import AddressCard from './src/components/AddressCard.vue'
  import { useAddress } from './src/composables/useAddress.ts'
  
  const {_p,_$p} = defineProps<{
      _p:_p_TYP,
      _$p:_$p_TYP,
  }>();
  
  const { addresses, getAddress, selectedAddress, showForm, formMode, form } = useAddress()
 
  onMounted(() => getAddress())
  watch(addresses, (val) => console.log('address updated:', val))

  // utiles to ready var for add address,
  const addAddress = () => {
    selectedAddress.value = null           
    Object.keys(form).forEach(k => form[k] = '') 
    formMode.value = 'create'
    showForm.value = true
  }

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
