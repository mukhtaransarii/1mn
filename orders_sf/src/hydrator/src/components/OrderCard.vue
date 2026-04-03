<template>
  <div v-for="o in order" :key="o.order_id" 
    class="bg-white dark:bg-zinc-800 flex flex-col gap-3 rounded-2xl p-4"
  >
    <div class="mb-2">
      <div v-if="o.items.some(i => i.order_status === 'processing')" class="inline-flex items-center gap-1 px-3 py-1.5 bg-linear-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.22-1.113-.615-1.53a15.14 15.14 0 0 0-2.084-1.662" />
        </svg>
        Ready for Pickup
      </div>
      <div v-if="o.items.some(i => i.return_status === 'approved')" class="ml-2 inline-flex items-center gap-1 px-3 py-1.5 bg-linear-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.22-1.113-.615-1.53a15.14 15.14 0 0 0-2.084-1.662" />
        </svg>
        Ready for return
      </div>
      <div class="text-xs font-mono text-gray-500 dark:text-zinc-400 mt-1">#{{ o.order_number }}</div>
    </div>
    
    <!-- Horizontal scroll items -->
    <div class="flex flex-row flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      <div
        v-for="item in o.items"
        :key="item.order_item_id"
        class="flex flex-col gap-2 snap-start"
        :class="item.order_status === 'cancelled' ? 'opacity-30 cursor-not-allowed' : ''"
      >
        <div class="relative rounded-xl overflow-hidden">
          <img
            :src="item?.reference_data?.variant_product_data?.image_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s'"           
            class="w-40 h-48 object-cover bg-gray-100 dark:bg-zinc-800  hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          <!-- --ABSOLUTE READY FOR PICKUP DOT; top-left -->
          <div v-if="item.order_status === 'processing'" class="absolute top-2 left-2 flex items-center justify-center">
            <span class="absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 animate-ping"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </div>

          <div v-if="item.order_status === 'processing'" class="absolute bottom-2 left-2 z-10 bg-blue-500/90 text-white  dark:bg-blue-600/90  inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-md shadow-lg">
            OTP: {{ item.delivery_otp }}
          </div>

          <!-- --ABSOLUTE OPTION; top-right -->
          <div v-if="item.order_status === 'delivered'" class="absolute top-2 right-2 group">
            <span @click="itemOptions = itemOptions === item.order_item_id ? null : item.order_item_id"  class="cursor-pointer shadow-lg absolute top-0 right-0 bg-white dark:bg-zinc-700 dark:text-white rounded-lg px-2 py-1 text-xs font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-3">
                <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm8.25 5.25a.75.75 0 0 1 .75-.75h8.25a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
              </svg>
            </span>
            
            <!-- overlay -->
            <div v-if="itemOptions === item.order_item_id" class="fixed inset-0 z-5" @click="itemOptions = null"></div>

            <div 
               class="absolute z-10 right-0 top-5 w-28 overflow-hidden bg-white/50 dark:bg-zinc-800/30 backdrop-blur-lg border border-white/30 dark:border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition text-xs"
               :class="{'visible opacity-100':itemOptions === item.order_item_id}"
               @click="itemOptions = null"
              >              
              <button
                v-if="item.order_status === 'delivered'"
                @click="openReviewModal(item)"
                class="cursor-pointer block w-full text-left px-3 py-2 rounded-md hover:bg-white/25 dark:hover:bg-white/10 transition"
              >
                {{ item.review ? 'Update Review' : 'Add Review' }}
              </button>
              <button
                v-if="item.return_status === 'none' && item.order_status === 'delivered'"
                @click="openReturnModal(item)"
                class="cursor-pointer block w-full text-left px-3 py-2 rounded-md hover:bg-red-500/20 transition text-red-500"
              >
                Return Item
              </button>
            </div>
          </div>
          
          <!-- --ABSOLUTE RETURN STATUS; bottom-left -->
          <span v-if="item.return_status !== 'none'" class="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-md shadow-lg capitalize"
            :class="{
              'bg-yellow-500/90 text-white dark:bg-yellow-600/90': item.return_status === 'requested',
              'bg-blue-500/90 text-white dark:bg-blue-600/90': item.return_status === 'approved',
              'bg-red-500/90 text-white dark:bg-red-600/90': item.return_status === 'rejected',
              'bg-green-500/90 text-white dark:bg-green-600/90': item.return_status === 'returned'
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3">
              <path d="M12 22V12"/><path d="M16 17h6"/><path d="M21 13V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955"/>
            </svg>
            {{ item.return_status }}
          </span>
          
          <!-- --ABSOLUTE RATING LABEL; bottom-right -->
          <span v-if="item.review" class="absolute bottom-2 right-2 bg-white dark:bg-zinc-700 dark:text-white rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1">
            <p class="text-yellow-500 text-xs">★</p>{{ item.review.rating }}
          </span>

          <!-- Red Overlay CANCELLED ITEM -->
          <div v-if="item.order_status === 'cancelled'" class="absolute inset-0 bg-red-500/40"></div>
        </div>


        <div>
          <p class="font-medium text-xs dark:text-white">{{ item.payable_price }} {{ o.pricing.currency }}</p>
          <p class="text-xs  dark:text-gray-200 w-40 line-clamp-2">{{ item.name }}</p>
          <p class="text-xs text-violet-500">{{ item.order_status }} ></p>
        </div>

        
        <!-- REVIEW MODAL -->
        <div
          v-if="activeReviewItem"
          class="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
          @click.self="closeReviewModal"
        >
          <div class="bg-white/40 backdrop-blur-lg dark:bg-zinc-800 rounded-2xl p-6 w-96 shadow-xl">

            <!-- Product Info -->
            <div class="flex items-center gap-3 mb-4 p-3 bg-gray-50/20 dark:bg-zinc-700/50 rounded-xl">
              <img 
                :src="activeReviewItem?.reference_data?.variant_product_data?.image_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s'" 
                class="w-12 h-12 object-cover rounded-lg"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ activeReviewItem?.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ activeReviewItem?.reference_data?.variant_product_data?.size }} • {{ activeReviewItem?.reference_data?.variant_product_data?.color }}
                </p>
              </div>
            </div>

            <label class="text-sm mt-3 block">Rating</label>
            <div class="flex gap-1">
            <svg
              v-for="i in 5"
              :key="i"
              @click="rating = i"
              viewBox="0 0 24 24"
              class="size-6 cursor-pointer transition"
              :class="i <= rating ? 'fill-yellow-400' : 'fill-gray-300'"
            >
              <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11a.56.56 0 0 0 .47.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.38a.56.56 0 0 1-.84.61L12 17.65a.56.56 0 0 0-.58 0l-4.73 2.89a.56.56 0 0 1-.84-.61l1.28-5.38a.56.56 0 0 0-.18-.56L2.74 10.4a.56.56 0 0 1 .32-.99l5.52-.44a.56.56 0 0 0 .47-.35L11.48 3.5Z"/>
            </svg>
          </div>

            <label class="text-sm">Review</label>
            <textarea
              v-model="reviewText"
              rows="3"
              placeholder="Write review"
              class="w-full mb-4 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white focus:outline-none"
            ></textarea>

            <div class="flex justify-end gap-3">
              <button @click="closeReviewModal" class="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-700">
                Cancel
              </button>

              <button
                @click="submitReview"
                :disabled="!reviewText.trim()"
                class="text-sm px-3 py-1 rounded-lg bg-yellow-500 text-white disabled:opacity-50"
              >
                {{ reviewSubmitting ? 'Saving...' : activeReviewItem?.review ? 'Update Review' : 'Submit Review' }}
              </button>
            </div>
          </div>
        </div>

         <!-- RETURN MODAL -->
        <div
          v-if="activeReturnItem"
          class="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
          @click.self="closeReturnModal"
        >
          <div class="bg-white/40 backdrop-blur-lg dark:bg-zinc-800 rounded-2xl p-6 w-96 shadow-xl">
            
            <!-- Product Info -->
            <div class="flex items-center gap-3 mb-4 p-3 bg-gray-50/20 dark:bg-zinc-700/50 rounded-xl">
              <img 
                :src="activeReturnItem?.reference_data?.variant_product_data?.image_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s'" 
                class="w-12 h-12 object-cover rounded-lg"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ activeReturnItem?.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Size: {{ activeReturnItem?.reference_data?.variant_product_data?.size }} • Color: {{ activeReturnItem?.reference_data?.variant_product_data?.color }}
                </p>
              </div>
            </div>
            
            <!-- Return Reason -->
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Reason for Return</label>
            <div class="relative mb-4">
              <select
                v-model="returnReason"
                class="w-full appearance-none px-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-shadow"
              >
                <option value="" disabled>Select a reason</option>
                <option value="size_issue">Size not fit</option>
                <option value="defective">Defective product</option>
                <option value="wrong_item">Wrong item delivered</option>
                <option value="quality_issue">Quality not as expected</option>
                <option value="other">Other</option>
              </select>

              <!-- custom arrow -->
              <svg
                class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd"/>
              </svg>
            </div>

            <!-- Additional Details (if "Other" selected) -->
            <input
              v-if="returnReason === 'other'"
              v-model="returnReasonDetail"
              type="text"
              placeholder="Please specify reason"
              class="w-full mb-4 px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 transition-shadow"
            />
            
            <div class="flex justify-end gap-3">
              <button @click="closeReturnModal" class="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-700">Cancel</button>

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
    

    <!-- Order Footer - Enhanced -->
    <div class="flex items-center justify-between border-t border-gray-100 dark:border-zinc-700 pt-4 px-1">
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">
          {{ new Intl.NumberFormat('en-IN', { style: 'currency', currency: o.pricing.currency, minimumFractionDigits: 0 }).format(o.pricing.final_amount) }}
        </p>
      </div>

      <button 
        @click="openOrder(o); getPaymentStatus(o.order_id);" 
        class="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
      >
        View Details
      </button>     
    </div>

    <!-- Ask About Order Button -->
    <button 
      @click="openChatBot" 
      class="cursor-pointer group bg-linear-to-r from-gray-50 to-gray-100 dark:from-zinc-700 dark:to-zinc-800 hover:from-violet-50 hover:to-violet-100 dark:hover:from-violet-900/30 dark:hover:to-violet-800/30 text-violet-600 dark:text-violet-400 font-medium rounded-xl p-4 text-center transition-all duration-300 border border-gray-200 dark:border-zinc-600 hover:border-violet-200 dark:hover:border-violet-700"
    >
      <span class="flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 group-hover:scale-110 transition-transform">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
        Ask about this order
      </span>
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
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useOrder } from "../composable/useOrder";


  defineProps({ order: { type: Array, required: true }}); // resposible for search filter from parent orderPage.vue
  //const {order:order,_p:_p,__p:_$p, } = defineProps();
  
  
  import BottomDrawer from "./BottomDrawer.vue";
  const { getPaymentStatus, payment_status, returnRequest, createReviewAndRating, updateReviewAndRating } = useOrder();
 
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
  const returnReasonDetail = ref('')
  const isSubmitting = ref(false)
  
  const openReturnModal = (item) => {
    activeReturnItem.value = item
  }

  const closeReturnModal = () => {
    activeReturnItem.value = null
    returnReason.value = ''
    returnReasonDetail.value = ''
  }

  const submitReturn = (order_id) => {
    if (!returnReason.value.trim()) return

    isSubmitting.value = true

    returnRequest(
      order_id,
      activeReturnItem.value.order_item_id,
      returnReason.value === 'other' ? returnReasonDetail.value : returnReason.value,
      '' // return_desc blank
    )
    isSubmitting.value = false

    returnReason.value = ''
    closeReturnModal()
  }

  // REVIEW STATES AND FUNCTIONS
  const activeReviewItem = ref(null)
  const rating = ref(0)
  const reviewText = ref('')
  const reviewSubmitting = ref(false)

  const openReviewModal = (item)=>{
    activeReviewItem.value = item

    if(item.review){
      rating.value = item.review.rating
      reviewText.value = item.review.review_text
    }else{
      rating.value = 0
      reviewText.value = ''
    }
  }

  const closeReviewModal = ()=>{
    activeReviewItem.value = null
  }

  const submitReview = async ()=>{
    if(!reviewText.value.trim()) return

    reviewSubmitting.value = true

    if(activeReviewItem.value.review){

      await updateReviewAndRating(
        activeReviewItem.value.review.review_id,
        rating.value,
        reviewText.value
      )

    }else{

      await createReviewAndRating(
        activeReviewItem.value.order_item_id,
        rating.value,
        reviewText.value
      )

    }

    reviewSubmitting.value = false
    reviewText.value=''
    rating.value=0
    closeReviewModal()
  }

  // ITEM LEVEL OPTIONS VARIABLE
  const itemOptions = ref(null)
  watch(itemOptions, (val) => {
    console.log("item option tap",val)
  })
</script>
