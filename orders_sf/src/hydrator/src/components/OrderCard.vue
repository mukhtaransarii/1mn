<template>
  <div v-for="o in order" :key="o.order_id" 
    class="bg-white dark:bg-zinc-800 flex flex-col gap-3 rounded-2xl p-4"
  >
    <div class="mb-2">
      <p class="text-xl text-green-500 font-semibold mb-1">Ready for Pickup</p>
      <p class="text-sm text-gray-500 dark:text-zinc-400 leading-none">order_id: {{ o.order_id }}</p>
      <p class="text-sm text-gray-500 dark:text-zinc-400 leading-none">pickup point • {{o.items.length}} items</p>
    </div>
    
    <!-- Horizontal scroll items -->
    <div class="flex flex-row flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      <div
        v-for="item in o.items"
        :key="item.order_item_id"
        class="flex flex-col gap-2 snap-start"
      >
        <div class="relative">
          <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s"
          class="w-40 h-48 object-cover bg-gray-100 dark:bg-zinc-800 rounded-xl"
          />

          <span class="absolute bottom-2 left-2 bg-white dark:bg-zinc-700 dark:text-white rounded-lg px-2 py-1 text-xs font-medium" v-if="item.return_status !== 'none'">{{ item.return_status }}</span>
        </div>


        <div>
          <div class="flex justify-between">
            <p class="font-medium text-xs dark:text-white">{{ item.payable_price }} {{ o.pricing.currency }}</p>

            <svg @click="openReturnModal(item)" v-if="item.return_status === 'none' && item.order_status === 'delivered'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-gray-500">
             <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
          </div>

          <p class="text-xs  dark:text-gray-200 w-40 line-clamp-3">{{ item.name }}</p>
          <p class="text-xs text-violet-500">{{ item.order_status }} ></p>
        </div>


         <!-- RETURN MODAL -->
        <div
          v-if="activeReturnItem"
          class="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
          @click.self="closeReturnModal"
        >
          <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 w-80 shadow-xl">
            
            <h3 class="font-semibold mb-3 dark:text-white">Return Item</h3>

            <p class="text-sm dark:text-gray-300 truncate">{{ activeReturnItem.name }}</p>
            <p class="text-xs text-gray-500">size: {{ activeReturnItem.reference_data.variant_product_data.size }}</p>
            <p class="text-xs mb-4 text-gray-500">color: {{ activeReturnItem.reference_data.variant_product_data.color }}</p>
            
            <label class="text-sm">Return reason</label>
            <input
              v-model="returnReason"
              type="text"
              placeholder="Enter return reason"
              class="w-full mb-4 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white focus:outline-none"
            />
            
            <div class="flex justify-end gap-3">
              <button
                @click="closeReturnModal"
                class="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-700"
              >
                Cancel
              </button>

              <button
                @click="submitReturn(o.order_id)"
                :disabled="!returnReason.trim()"
                class="text-sm px-3 py-1 rounded-lg bg-red-500 text-white disabled:opacity-50"
              >
                {{ isSubmitting ? 'Submitting...' : 'Confirm Return' }}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between border-t border-gray-500 dark:border-zinc-700 pt-6 px-1">
      <p 
        @click="openOrder(o); getPaymentStatus(o.order_id);" 
        class="cursor-pointer font-medium dark:text-white"
      >
       {{ o.pricing.final_amount }} {{ o.pricing.currency }}
      </p>

      <p class="text-sm dark:text-gray-200">Pay for {{ o.items.length }} items</p>     
    </div>

    <button @click="openChatBot" class="bg-gray-100 dark:bg-zinc-700 text-violet-500 font-medium rounded-2xl p-4 text-center">
      Ask about order
    </button>
  </div>
  
  <!--ABSOLUTE BOX-->
  <BottomDrawer 
    v-model:open="open"
    :order="selectedOrder"
    :isMobile="isMobile"
  />
</template>


<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useOrder } from "../composable/useOrder";


  defineProps({ order: { type: Array, required: true }}); // resposible for search filter from parent orderPage.vue
  //const {order:order,_p:_p,__p:_$p, } = defineProps();
  
  
  import BottomDrawer from "./BottomDrawer.vue";
  const { getPaymentStatus, payment_status, returnRequest} = useOrder();
 
  const open = ref(false)
  const selectedOrder = ref(null)
  const isMobile = ref(window.innerWidth < 768)

  // auto update on resize
  const checkMobile = () => isMobile.value = window.innerWidth < 768
  onMounted(() => window.addEventListener('resize', checkMobile))
  onUnmounted(() => window.removeEventListener('resize', checkMobile))

  const openOrder = (orderItem) => {
    selectedOrder.value = orderItem
    open.value = true
  }
  
  const openChatBot = () => alert('It will open chatbot')

  

  // return request functions and variables
  const activeReturnItem = ref(null)
  const returnReason = ref('')
  const isSubmitting = ref(false)


  const toggleReturn = (id) => {
    activeReturnItem.value =
      activeReturnItem.value === id ? null : id
  }
  
  const openReturnModal = (item) => {
    activeReturnItem.value = item
  }

  const closeReturnModal = () => {
    activeReturnItem.value = null
  }

  const submitReturn = (order_id) => {
    if (!returnReason.value.trim()) return

    isSubmitting.value = true

    const res = returnRequest(
      order_id,
      activeReturnItem.value.order_item_id,
      returnReason.value,
      '' // return_desc blank
    )
    isSubmitting.value = false

    returnReason.value = ''
    closeReturnModal()
  }
</script>
