<template>
    <div class="flex flex-1 flex-col gap-3">
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
      
      
      <!--DELIVERED ITEMS RENDER-->
      <div class="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        <template v-for="o in filteredOrders" :key="o.order_id">
          <div
            v-for="item in o.items"
            :key="item.order_item_id"
            class="bg-white dark:bg-zinc-800  rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition"
          >
            <!-- Image -->
             <div class="relative">
               <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s"
                class="aspect-[40/48] w-full h-full object-cover rounded-xl"
               />
               <span class="absolute bottom-2 left-2 bg-white dark:bg-zinc-700 dark:text-white rounded-lg px-2 py-1 text-xs font-medium" v-if="item.return_status !== 'none'">{{ item.return_status }}</span>
            </div>


            <!-- Info -->
            <div class="flex flex-col gap-1">
              <p class="font-medium text-sm dark:text-white">{{ item.payable_price }} {{ o.pricing.currency }}</p>
              <p class="text-xs dark:text-gray-300 line-clamp-2">{{ item.name }}</p>

              <p class="text-xs text-violet-500">
                {{ item.order_status }} at {{
                  new Date(item.delivered_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }).toLowerCase()
                }}
              </p>

              <p class="text-xs text-violet-500" v-if="item.return_status !== 'none' && item.order_status === 'delivered' && item.returned_at">
                {{ item.return_status }} at {{
                  new Date(item.returned_at).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }).toLowerCase()
                }}
              </p>
            </div>

            <!-- Rating -->
            <div class="flex gap-1">
              <svg
                v-for="i in 5"
                :key="i"
                viewBox="0 0 24 24"
                class="size-4"
                :class="i <= 4 ? 'fill-yellow-400' : 'fill-gray-300'"
              >
                <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11a.56.56 0 0 0 .47.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.38a.56.56 0 0 1-.84.61L12 17.65a.56.56 0 0 0-.58 0l-4.73 2.89a.56.56 0 0 1-.84-.61l1.28-5.38a.56.56 0 0 0-.18-.56L2.74 10.4a.56.56 0 0 1 .32-.99l5.52-.44a.56.56 0 0 0 .47-.35L11.48 3.5Z"/>
              </svg>
            </div>

            <!-- Button -->
            <button
              @click="similarItem"
              class="bg-violet-500 hover:bg-violet-600 transition p-3 text-white rounded-xl text-sm font-medium"
            >
              Similar items
            </button>
          </div>
        </template>
      </div>
      
      <!--IF NO DELIVERED ITEMS AVAILBLE-->
      <p v-if="!filteredOrders.length"
        class="p-4 bg-white dark:bg-zinc-800 rounded-xl text-sm text-gray-500 dark:text-gray-300"
      >
        No delivered items found
      </p>
    </div>
    
    <!--ABSOLUTE BOTTOM FILTER-->
    <div class="fixed bottom-4 left-4 flex items-center gap-3">
      <div @click="priceSorting" class="p-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 dark:text-white border-2 border-white dark:border-zinc-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-violet-500 size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
      </div>
      
      <div @click="statusSorting" class="flex items-center gap-1 p-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 dark:text-white border-2 border-white dark:border-zinc-700">
        Status
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      
      <div @click="dateSorting" class="flex items-center gap-1 p-2 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 dark:text-white border-2 border-white dark:border-zinc-700">
        All time
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { useOrder } from "../composable/useOrder";
  const { deliveredOrder } = useOrder();
  
  const similarItem = () => alert('Redirect to storefront page');


  

  
  const search = ref('')
  const filteredOrders = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return deliveredOrder.value

    return deliveredOrder.value
      .map(deliveredOrder => {
        const matchedItems = deliveredOrder.items.filter(item =>
          item.name?.toLowerCase().includes(q) ||
          item.reference_data?.product_data?.brand
            ?.toLowerCase()
            .includes(q) ||
          String(deliveredOrder.order_id) === q
        )

        return matchedItems.length
          ? { ...deliveredOrder, items: matchedItems }
          : null
      })
      .filter(Boolean)
  })
  
  const priceSorting = () => alert('comming soon')
  const statusSorting = () => alert('comming soon')
  const dateSorting = () => alert('comming soon')
</script>