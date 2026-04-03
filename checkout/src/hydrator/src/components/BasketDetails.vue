<template>
  <div class="flex flex-col flex-1 gap-3">
    <div class="flex flex-col-reverse md:flex-col md:gap-3 rounded-b-2xl overflow-hidden">
      <!-- Sale Banner -->
      <div class="bg-white dark:bg-zinc-800 flex items-center gap-3 md:rounded-2xl md:py-2 px-4 md:min-h-16">
        <div class="md:bg-[#fceef4] dark:md:bg-zinc-800 md:p-2 rounded-lg">
          <Flame class="w-5 h-5 text-[#f1117e]" />
        </div>

        <div class="flex flex-1 items-center justify-between">
          <div class="flex flex-col flex-1">
              <span class="text-sm md:text-lg leading-none text-zinc-900 dark:text-zinc-100">Don't miss out on the sale</span>
              <span class="text-sm md:text-md text-gray-500 dark:text-zinc-400">1 item will soon go up in price</span>
          </div>

          <div class="bg-[#fceef4] dark:bg-zinc-800 rounded-lg px-2">
              <span class="text-[#f1117e] md:font-bold font-medium text-xs md:text-sm">15 days left</span>
          </div>
        </div>
      </div>

      <!-- selectall toggle -->
      <div class="bg-white dark:bg-zinc-800 flex items-center justify-between gap-3 md:rounded-2xl md:py-2 px-4 md:min-h-16">
        <label class="flex items-center cursor-pointer text-zinc-900 dark:text-zinc-100">
          <input 
            type="checkbox" 
            :checked="isAllSelected"
            @change="toggleSelectAll"
            class="rounded border-gray-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
          >
          <span class="ml-2">Select all</span>
        </label>

        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-lg px-2 py-1 text-gray-500 dark:text-zinc-400">
              <Forward class="md:w-5 md:h-5 w-4 h-4" />
              <p class="text-xs md:text-sm md:block hidden">Share</p>
          </div>
          <div class="bg-gray-100 dark:bg-zinc-800 rounded-lg px-2 py-1 text-gray-500 dark:text-zinc-400">
              <Trash class="md:w-5 md:h-5 w-4 h-4"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Item Content -->
    <div class="bg-white dark:bg-zinc-800 flex flex-col gap-1 rounded-2xl p-4 min-h-16">
       <div class="md:bg-gray-100 dark:md:bg-zinc-900 flex flex-1 items-center justify-between gap-3 rounded-2xl md:px-4 md:min-h-16">
         <p class="font-bold text-zinc-900 dark:text-zinc-100">Available for order</p>

         <!-- coupone code input -->
         <div>
          <div class="bg-white dark:bg-zinc-900 flex items-center rounded-xl overflow-hidden">
              <input
                v-model="selectedCoupon"
                type="text"
                placeholder="Enter coupon code"
                class="bg-transparent px-3 py-2 text-sm outline-none text-zinc-900 dark:text-zinc-100 w-auto"
              />

              <button
                class="bg-[#f1117e] text-white text-sm font-medium px-4 py-2 hover:opacity-90 ml-2 disabled:opacity-40 disabled:cursor-not-allowed"
                @click="applyCoupon"
                :disabled="!selectedCoupon"
              >
                Apply
              </button>
          </div>

          <p class="text-red-500 text-xs ml-2" v-if="validateCouponMsg">{{ validateCouponMsg }}</p>
         </div>
       </div>
       
       <div 
         v-for="item in items as any[]" :key="item.cart_item_id" 
         :class="item.is_selected ? 'opacity-100' : 'opacity-50'"
         class="bg-white dark:bg-zinc-900 flex gap-3 rounded-2xl px-2 py-4 min-h-16"
       >
          <div class="absolute bg-white dark:bg-zinc-900 pr-1.5 rounded-br-lg">
             <input 
               type="checkbox" 
               v-model="item.is_selected" 
               @change="toggleSelect(item.is_selected ,item.cart_item_id)"
               class="rounded border-gray-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 h-4 w-4"
              >
          </div>
          <img
            :src="item?.variant_product_data?.image_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s'"           
            class="w-24 h-24 object-cover aspect-square bg-gray-100 dark:bg-zinc-800"
            loading="lazy"
          />
          
          <div class="flex-1">
            <div class="flex justify-between flex-col md:flex-row">
               <div class="flex flex-col-reverse order-2 md:order-1 md:block">
                  <div class="block md:hidden text-xs font-bold text-gray-500 dark:text-zinc-400" v-html="item.product_data.field_value[0]"></div>
                  <p class="font-semibold text-zinc-900 dark:text-zinc-100">{{ item.product_data.title }}</p>
                  <div class="inline-flex self-start bg-[#f1117e] items-center gap-1 rounded px-1">
                    <Flame class="w-5 h-5 text-white"/>
                    <p class="text-sm text-white font-semibold mr-1">Sale</p>
                  </div>
               </div>

               <div class="flex gap-1 flex-row items-center order-1 md:order-2 md:block">
                  <div class="flex items-center">
                     <p class="font-bold text-[#f1117e]">{{ item.pricing.price }} {{ item.pricing.currency }}</p>
                     <Wallet class="w-5 h-5 text-[#f1117e]"/>           
                  </div>
                  <p class="font-bold text-xs text-gray-500 dark:text-zinc-400 line-through">{{ item.variant_product_data.mrp }} {{ item.pricing.currency }}</p>
               </div>

               <div class="flex items-center gap-1 order-3 md:block">
                  <div class="bg-gray-100 dark:bg-zinc-800 rounded-lg inline-flex self-start md:mb-1 px-2">
                    <button
                      @click="item.pricing.quantity--; quantityUpdate(item.cart_item_id, item.pricing.quantity)"
                      :disabled="item.pricing.quantity <= 1"
                      class="disabled:opacity-40 disabled:cursor-not-allowed"
                    >-</button>
                    <span class="mx-4 font-medium text-zinc-900 dark:text-zinc-100">{{ item.pricing.quantity }}</span>
                    <button
                      @click="item.pricing.quantity++; quantityUpdate(item.cart_item_id, item.pricing.quantity)"
                      :disabled="item.pricing.quantity >= 3"
                      class="disabled:opacity-40 disabled:cursor-not-allowed"
                    >+</button>
                  </div>
                  <p class="text-xs md:text-center font-bold text-orange-500 bg-orange-100 dark:bg-zinc-800 md:bg-transparent px-2 py-1 md:py-1 rounded-lg">Quantity is limited</p>
               </div>
            </div>

             <!-- description -->
             <div class="hidden md:block text-xs text-gray-600 dark:text-zinc-400"
                v-html="item.product_data.field_value[0]">
             </div>

             <!-- actions button -->
              <div class="flex items-center gap-2 mt-2">
                <div class="bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700"
                   @click="addToFavorites(item.product_id)"
                >
                  <Heart class="w-5 h-5"/>
                </div>

                <div class="bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700"
                  @click="removeFromCart(item.cart_item_id)"
                >
                  <Trash class="w-5 h-5"/>
                </div>

                <!-- <div class="bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 md:block hidden">
                  <p class="font-semibold text-sm">Buy</p>
                </div> -->
              </div>
          </div>

       </div>

    </div>
   
  </div>
</template>


<script lang="ts" setup>
  import { ref } from "vue";
  import { Flame, Forward, Heart, Trash, Wallet } from 'lucide-vue-next';
  import { useCart } from "../composable/useCart";

 const {_ins,_$p,_p} = defineProps<{
      _ins:any,
      _$p:any,
      _p:any,
  }>();

  const { items, toggleSelect, toggleSelectAll, isAllSelected, quantityUpdate, removeFromCart, submit, selectedCoupon, addToFavorites, validateCoupon } = useCart({_ins:_ins,_$p:_$p,_p:_p});
  
  const validateCouponMsg = ref();

  const applyCoupon = async () => {
    if (!selectedCoupon.value) return;

    validateCouponMsg.value = await validateCoupon(selectedCoupon.value);
    submit(selectedCoupon.value);
  };
</script>