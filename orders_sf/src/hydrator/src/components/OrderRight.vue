  <template>
    <div class="w-full md:w-[30vw] self-start bg-white dark:bg-zinc-800 rounded-2xl">
      <div class="p-4">
        <p class="font-medium dark:text-white">Share your experience</p>
        <p class="text-xs text-gray-500 dark:text-gray-200">Help others make the right choice</p>
      </div>
  
      <template v-for="o in deliveredOrder" :key="o.order_id">
        <div
          v-for="item in o.items"
          :key="item.order_item_id"
          class="bg-white dark:bg-zinc-800  rounded-2xl p-4 flex flex-row gap-3 transition"
        >
          <!-- Image -->
          <div class="relative shrink-0">
              <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s"
              class="w-40 h-48 object-cover rounded-xl"
              />
              <span class="absolute bottom-2 left-2 bg-white dark:bg-zinc-700 dark:text-white rounded-lg px-2 py-1 text-xs font-medium" v-if="item.return_status !== 'none'">{{ item.return_status }}</span>
          </div>
          
          <div class="flex flex-col justify-between">
            <!-- Info -->
            <div class="flex flex-col gap-1">
              <p class="font-medium text-sm dark:text-white">{{ item.payable_price }} {{ o.pricing.currency }}</p>
              <p class=" dark:text-gray-300 line-clamp-2">{{ item.name }}</p>
              
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
          </div>
        </div>
    </template>

    <!-- Empty state -->
    <p v-if="!deliveredOrder.length" class="text-sm text-gray-500 dark:text-gray-300 p-4">
      No items delivered yet
    </p>
  </div>
</template>

<script setup>
  import { useOrder } from "../composable/useOrder";
  //const {_p,_$p} = defineProps();

  const { deliveredOrder } = useOrder();
</script>