<template>
    <div class="flex md:w-[70vw] flex-col gap-3">
      <!-- Search order -->
      <div class="bg-white dark:bg-zinc-800 flex items-center gap-2 md:rounded-2xl rounded-b-2xl p-4">
        <div class="w-full md:max-w-sm flex items-center gap-2 bg-gray-100 dark:bg-zinc-700 rounded-2xl p-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-zinc-900 dark:text-zinc-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
  
         <input 
          v-model="search"
          type="text"
          placeholder="Name, Brand, Order Id"
          class="bg-transparent outline-none focus:outline-none focus:ring-0 border-0 text-zinc-900 dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
         >
        </div>
      </div>
      
      <!-- show QR code at pickup point -->
      <div @click="toggleQR = true" class="bg-white dark:bg-zinc-800 flex items-center gap-2 rounded-2xl p-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 md:size-6 text-zinc-900 dark:text-zinc-100">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
        </svg>
        
        <p class="text-xs text-zinc-900 dark:text-zinc-100">
          Show the QR code or tell the code <mark class="bg-transparent text-violet-500 font-medium">354955</mark> at the pickup point to pick up your order
        </p>
      </div>
  
      <!-- Purchased button -->
      <div @click="page_state='PURCHASED_PAGE'" class="bg-white dark:bg-zinc-800 flex items-center justify-between gap-2 rounded-2xl px-4 py-6 md:py-4">
        <div class="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
    
          <p>Purchased</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-zinc-900 dark:text-zinc-100">
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
      
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.order_id"
        :order="[order]"
      />
      
      <div v-show="toggleQR" @click="toggleQR = false" class="fixed bg-black/20 h-screen w-screen bottom-0 right-0 z-50 flex items-end md:justify-end md:p-4">
        <QR/>
      </div>
    </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import OrderCard from '../components/OrderCard.vue';
  import QR from '../components/QR.vue';

  import { useOrder } from '../composable/useOrder.ts';

  //const {_p,_$p} = defineProps();


  const { order, page_state } = useOrder();
  
  const search = ref('')
  const filteredOrders = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return order.value

    return order.value
      .map(order => {
        const matchedItems = order.items.filter(item =>
          item.name?.toLowerCase().includes(q) ||
          item.reference_data?.product_data?.brand
            ?.toLowerCase()
            .includes(q) ||
          String(order.order_id) === q
        )

        return matchedItems.length
          ? { ...order, items: matchedItems }
          : null
      })
      .filter(Boolean)
  })
  
  const toggleQR = ref(false)
</script>