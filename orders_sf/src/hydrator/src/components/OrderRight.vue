  <template >
    <div 
         v-show="deliveredOrder.some(o => o.items.some(i => i.review == null))"
         class="w-full md:w-[30vw] self-start bg-white dark:bg-zinc-800 rounded-2xl shrink-0"
    >
      <div class="p-4">
        <p class="font-medium dark:text-white">Share your experience</p>
        <p class="text-xs text-gray-500 dark:text-gray-200">Help others make the right choice</p>
      </div>
  
      <template v-for="o in deliveredOrder" :key="o.order_id">
          <div
            v-for="item in o.items.filter((i) => i.review === null)"
            :key="item.order_item_id"
            class="bg-white dark:bg-zinc-800  rounded-2xl p-4 flex flex-row gap-3 transition"
          >
            <!-- Image -->
            <div class="relative shrink-0 rounded-xl overflow-hidden">
                <img
                  :src="item?.reference_data?.variant_product_data?.image_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s'"           
                  class="w-40 h-48 object-cover bg-gray-100 dark:bg-zinc-800  hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
            </div>
            
            <div class="flex flex-col justify-between">
              <div>
                <p class="font-medium text-sm dark:text-white">{{ item.payable_price }} {{ o.pricing.currency }}</p>
                <p class="text-sm  dark:text-gray-200 w-40 line-clamp-3">{{ item.name }}</p>
                <p class="text-sm text-violet-500">
                  {{ item.order_status }} at {{
                    new Date(item.delivered_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }).toLowerCase()
                  }}
                </p>
              </div>

              <div>
                <!-- Review Section - Minimalist Clean -->
                <div class="flex gap-1">
                  <svg
                    v-for="i in 5"
                    :key="i"
                    viewBox="0 0 24 24"
                    class="size-4"
                    :class="i <= Math.round(item.review?.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                    fill="currentColor"
                  >
                    <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11a.56.56 0 0 0 .47.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.38a.56.56 0 0 1-.84.61L12 17.65a.56.56 0 0 0-.58 0l-4.73 2.89a.56.56 0 0 1-.84-.61l1.28-5.38a.56.56 0 0 0-.18-.56L2.74 10.4a.56.56 0 0 1 .32-.99l5.52-.44a.56.56 0 0 0 .47-.35L11.48 3.5Z"/>
                  </svg>
                </div>

                <button
                  @click="openReviewModal(item)"
                  class="cursor-pointer mt-2 text-xs font-medium px-2 py-1 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
                >
                  Add Review
                </button>
              </div>
              
             

            </div>

             <!-- REVIEW MODAL Absolute -->
              <div
                v-if="activeReviewItem"
                class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                @click.self="closeReviewModal"
              >
                <div class="bg-white/70 backdrop-blur-lg dark:bg-zinc-800 rounded-2xl p-6 w-96 shadow-xl">

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
          </div>
      </template>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useOrder } from "../composable/useOrder";
  const { deliveredOrder, createReviewAndRating } = useOrder();

  // REVIEW STATES AND FUNCTIONS
  const activeReviewItem = ref(null)
  const rating = ref(0)
  const reviewText = ref('')
  const reviewSubmitting = ref(false)

  const openReviewModal = (item)=>{
    activeReviewItem.value = item
  }

  const closeReviewModal = ()=>{
    activeReviewItem.value = null
  }

  const submitReview = async ()=>{
    if(!reviewText.value.trim()) return

    reviewSubmitting.value = true

    await createReviewAndRating(
      activeReviewItem.value.order_item_id,
      rating.value,
      reviewText.value
    )

    reviewSubmitting.value = false
    reviewText.value=''
    rating.value=0
    closeReviewModal()
  }

</script>