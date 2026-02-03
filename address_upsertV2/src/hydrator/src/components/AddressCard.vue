<template>
  <div 
    v-for="address in addresses" 
    :key="address.address_id"
    class="shadow-md pt-4 bg-white dark:bg-zinc-800"
  >
    <div class="flex items-center justify-between px-4">
      <p class="font-medium text-sm dark:text-white">{{ address.name }}</p>
      <p class="font-medium text-sm dark:text-white">{{ address.address_type }}</p>
    </div>

    <div class="text-sm mt-2 text-light text-gray-500 px-4">
      <p>{{ address.street }}</p>
      <p>{{address.landmark}}</p>
      <p>{{address.city}}</p>
      <p>{{address.state}}</p>
      <p>{{address.pincode}}</p>

      <p class="mt-2">Mobile No.: {{ address.phone_number }}</p>
    </div>

    <div class="flex justify-between items-center border-t border-black/20 mt-2">
      <button @click="editAddress(address)" class="font-medium text-violet-500 text-center flex-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 py-2">EDIT</button>
      <p class="text-black/20">|</p>
      <button @click="removeAddress(address.address_id)" class="font-medium text-violet-500 text-center flex-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 py-2">REMOVE</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAddress } from '../composables/useAddress.ts';
  const { addresses, selectedAddress, formMode, showForm, form, removeAddress } = useAddress();

  const editAddress = (address:any) => {
    selectedAddress.value = address
    Object.assign(form, { ...address })
    formMode.value = 'update'
    showForm.value = true
  }

</script>