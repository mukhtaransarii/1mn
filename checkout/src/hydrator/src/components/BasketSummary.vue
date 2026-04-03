<template>
    <div class="flex flex-col gap-4 md:max-w-md">
      <div class="bg-white dark:bg-zinc-800 flex flex-col-reverse md:flex-col gap-4 rounded-2xl p-6">
         <div class="md:border-b border-gray-400 dark:border-zinc-700 pb-4">
           <button 
              class="font-bold text-white w-full rounded-xl p-4 mb-2 bg-blue-500 md:bg-green-500 md:disabled:bg-green-200 disabled:bg-blue-200 dark:md:bg-green-600 dark:md:disabled:bg-green-900 dark:disabled:bg-blue-900"
              @click="proceedToCheckout"
              :disabled="selectedItems.length === 0 || _ins.var.btn.disable"
            >
              {{_ins.var.step.curr_data['btn'].txt}}
           </button>
          
           <!-- Stripe Ui -->
          <div v-show="payStripe && _$p.data.curr.data.pg_provider === 'stripe'" class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-4 flex flex-col w-[45vw] gap-4">
              <p class="text-sm font-medium">Pay with Stripe</p>
              
              <div id="stripe-card-element" class="mt-4"></div>
              <button
              class="font-bold text-white w-full rounded-xl p-3 bg-indigo-600 mt-3"
              @click="payStripe?.()"
              >
              Pay with Stripe
            </button>
           </div>
          </div>
          
           <p class="text-gray-500 dark:text-zinc-400 text-sm">
             Available delivery methods and times can be selected when placing an order.
           </p>
         </div>
         
         <div>
            <div class="flex items-end justify-between mb-4"> 
              <h1 class="font-bold text-xl text-zinc-900 dark:text-zinc-100">Your cart</h1>
              <p class="text-sm text-gray-500 dark:text-zinc-400">
                {{ items.length }} item<span v-if="items.length > 1">s</span>
              </p>
            </div>
            
            <div class="flex items-end justify-between mb-2"> 
              <h1 class="text-zinc-900 dark:text-zinc-100">Products ({{ selectedItems.length }})</h1>
              <p class="font-bold text-zinc-900 dark:text-zinc-100">{{ totalPrice.toFixed(2) }} {{ currency }}</p>
            </div>
            
            <div class="flex items-start justify-between mb-4"> 
              <div>
                <h1 class="leading-none text-zinc-900 dark:text-zinc-100">Discount</h1>
                <button class="text-blue-600 dark:text-blue-400 font-semibold">Read more</button>
              </div>
              <p class="font-bold text-[#f1117e]">- {{ discount }} {{ currency }}</p>
            </div>

            <div class="flex items-end justify-between pt-4 border-t border-gray-400 dark:border-zinc-700"> 
              <h1 class="font-bold text-xl text-zinc-900 dark:text-zinc-100">With Ozon Card</h1>
              <p class="font-bold text-lg text-green-500 dark:text-green-400">
                {{ totalPayable.toFixed(2) }} {{ currency }}
              </p>
            </div>

            <div class="flex items-end justify-between"> 
              <h1 class="text-gray-500 dark:text-zinc-400">Without Ozon Card</h1>
              <p class="font-semibold text-gray-500 dark:text-zinc-400">
                {{ Math.round(totalPayable * 1.02).toFixed(2) }} {{ currency }}
              </p>
            </div>
         </div>           
      </div>
      
      <div class="hidden md:block">
        <div class="bg-white dark:bg-zinc-800 flex items-center gap-3 rounded-2xl py-2 px-4 min-h-16">
          <div class="bg-violet-500 p-2 rounded-lg">
            <Wallet class="w-5 h-5 text-violet-100" />
          </div>
                
          <div class="flex flex-1 items-center justify-between">
            <div class="flex flex-col flex-1">
                <span class="text-lg leading-none text-zinc-900 dark:text-zinc-100">
                  With an Ozon credit card
                </span>
                <span class="text-gray-500 dark:text-zinc-400">
                  0% up to 78 days
                </span>
            </div>        
            <ChevronRight class="w-5 h-5 text-gray-500 dark:text-zinc-400" />
          </div>
        </div>
      </div>   
    </div>
</template>

<script lang="ts"  setup>
  import { computed, ref, onMounted } from "vue";
  import { ChevronRight, Flame, Forward, Heart, Trash, Wallet } from 'lucide-vue-next';
  import { useCart } from "../composable/useCart";

   const {_ins,_$p,_p} = defineProps<{
      _ins:any,
      _$p:any,
      _p:any,
  }>();

  const { items, totalPayable, currency, discount, totalPrice, proceedToCheckout, selectedItems, payStripe } = useCart({_ins:_ins,_$p:_$p,_p:_p});
</script>