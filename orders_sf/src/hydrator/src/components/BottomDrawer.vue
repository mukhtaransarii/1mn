<template>
  <transition :name="isMobile ? 'slide-up' : 'fade'">
    <div 
      v-show="open" 
      @click.self="close"
      class="fixed h-screen w-screen bottom-0 z-50 flex items-end md:items-center justify-center md:bg-black/30"
    >
      <!-- Modal Container -->
      <div 
        class="bg-gray-100 dark:bg-zinc-700 w-full shadow-lg border-t border-gray-300 dark:border-zinc-600"
        :class="isMobile ? 'rounded-t-xl' : 'rounded-xl max-w-sm mx-4'"
        @click.stop
      >
        <!-- Handle for mobile -->
        <div v-if="isMobile" class="pt-3 pb-2">
          <div class="w-16 h-1 bg-gray-400 dark:bg-zinc-500 rounded-full mx-auto"></div>
        </div>
        
        <!-- Content -->
        <div v-if="order" class="p-4">
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-base">Order id: {{ order.order_id }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ order.items.length }} items</p>
            </div>
            <button 
              @click="close"
              class="hidden md:block text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Price Section -->
          <div class="bg-white dark:bg-zinc-800 rounded-lg p-4 mb-3 border border-gray-200 dark:border-zinc-600">
            <div class="space-y-2.5">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span class="text-gray-900 dark:text-white">
                  {{ order.pricing.total_payable_price }} {{ order.pricing.currency }}
                </span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Tax</span>
                <span class="text-gray-900 dark:text-white">
                  {{ order.pricing.tax_amount }} {{ order.pricing.currency }}
                </span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Delivery</span>
                <span class="text-green-600 dark:text-green-400">FREE</span>
              </div>

              <div class="pt-3 border-t border-gray-300 dark:border-zinc-600">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span class="text-lg font-bold text-green-600 dark:text-green-400">
                    {{ order.pricing.final_amount }} {{ order.pricing.currency }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Badges -->
          <div class="flex gap-2 mb-4">
            <div class="flex-1 bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-600">
              <div class="flex items-center gap-2 mb-1.5">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
                ]"></div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Payment</span>
              </div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ payment_status || 'Processing' }}
              </p>
            </div>
            
            <div class="flex-1 bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-600">
              <div class="flex items-center gap-2 mb-1.5">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Delivery</span>
              </div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                {{ order.items[0].order_status }}
              </p>
            </div>
          </div>

          <!-- Address Section -->
          <div class="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-gray-200 dark:border-zinc-600">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Shipping Address</p>
                <p class="text-sm text-gray-900 dark:text-white font-medium">{{ order.shipping_address.name }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ order.shipping_address.street }}{{ order.shipping_address.landmark ? ', ' + order.shipping_address.landmark : '' }}<br>
                  {{ order.shipping_address.city }}, {{ order.shipping_address.state }} {{ order.shipping_address.pincode }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
  import { watch } from 'vue';
  import { useOrder } from '../composable/useOrder';



  defineProps({
    order: { type: Object, required: false, default: null }, // use Object, not Array
    open: { type: Boolean, required: true },
    isMobile: { type: Boolean, required: true }
  });


  //const {_p,_$p, order, open, isMobile} = defineProps();


  const { payment_status } = useOrder();




  const emit = defineEmits(['update:open'])
  const close = () => emit('update:open', false)
</script>
