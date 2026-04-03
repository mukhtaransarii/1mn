<template>
  <div class="flex justify-center items-center min-h-screen p-6 bg-gray-100 dark:bg-zinc-900">
    <div class="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-zinc-700 rounded-full mb-1">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-zinc-100 mb-1">
          Select Payment Method
        </h1>
      </div>

      <!-- Order Summary -->
      <div class="bg-gray-50 dark:bg-zinc-900 rounded-xl p-5 mb-6 border border-gray-200 dark:border-zinc-700">
        <h2 class="font-semibold text-gray-700 dark:text-zinc-300 mb-3 text-sm uppercase tracking-wider">
          Order Summary
        </h2>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
            <span class="text-gray-600 dark:text-zinc-400 text-sm">Order ID:</span>
            <span class="font-medium text-gray-800 dark:text-zinc-100 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded text-sm">
              {{ currentOrder?.order.order_id }}
            </span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-700">
            <div>
              <span class="font-medium text-gray-800 dark:text-zinc-100 block">
                {{ currentOrder?.items[0].name }}
              </span>
              <span class="text-gray-500 dark:text-zinc-400 text-sm mt-1">
                Size: {{ currentOrder?.items[0].size }} • Qty: {{ currentOrder?.items[0].quantity }}
              </span>
            </div>
            <span class="font-bold text-gray-900 dark:text-zinc-100">
              ${{ currentOrder?.items[0].price }}
            </span>
          </div>
          
          <div class="flex justify-between items-center pt-2">
            <span class="font-semibold text-gray-700 dark:text-zinc-300">Total</span>
            <span class="text-xl font-bold text-green-600 dark:text-green-400">
              ${{ currentOrder?.items[0].price * currentOrder?.items[0].quantity }}
            </span>
          </div>
        </div>
      </div>

      <!-- Payment Gateway Selection -->
      <div class="mb-6">
        <label class="block text-gray-700 dark:text-zinc-300 font-medium mb-2 text-sm">
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            Payment Gateway
          </span>
        </label>
        
        <div class="relative">
          <select
            v-model="paymentGateway"
            class="w-full border-2 border-gray-300 dark:border-zinc-700 rounded-xl px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 transition-all duration-200 appearance-none bg-white dark:bg-zinc-900 cursor-pointer text-gray-700 dark:text-zinc-100 font-medium"
          >
            <option value="" disabled selected class="text-gray-400">Select payment gateway</option>
            <option value="tbank" class="py-2">TBank - Secure Payment</option>
          </select>
          
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <p class="text-gray-500 dark:text-zinc-400 text-xs mt-2 flex items-center gap-1">
          <svg class="w-4 h-4 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          All transactions are secure and encrypted
        </p>
      </div>

      <!-- Pay Now Button -->
      <button
        @click="payNow(paymentGateway)"
        :disabled="!paymentGateway"
        class="w-full bg-green-500 dark:bg-green-600 text-white font-semibold px-4 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center gap-2"
      >
        <svg v-if="paymentGateway" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span class="text-lg">
          {{ paymentGateway ? `Pay with ${paymentGateway}` : 'Select Gateway to Pay' }}
        </span>
        <span v-if="paymentGateway" class="font-bold ml-auto">
          ${{ currentOrder.items[0].price * currentOrder.items[0].quantity }}
        </span>
      </button>

      <!-- Security Badges -->
      <div class="flex justify-center items-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
        <div class="text-center">
          <div class="text-gray-400 dark:text-zinc-500 mb-1">
            <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xs text-gray-500 dark:text-zinc-400">SSL Secure</span>
        </div>
        
        <div class="text-center">
          <div class="text-gray-400 dark:text-zinc-500 mb-1">
            <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xs text-gray-500 dark:text-zinc-400">256-bit Encryption</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
  import { ref } from "vue";
  import { useCart } from "../composable/useCart";
  import { useOrder } from "../contexts/useOrder";

   const {_ins,_$p,_p} = defineProps<{
      _ins:any,
      _$p:any,
      _p:any,
  }>();

  const paymentGateway = ref("");
  const { payNow } = useCart({_ins:_ins,_$p:_$p,_p:_p});
  const { currentOrder } = useOrder();
</script>