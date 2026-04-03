<template>

    <div v-if="_ins.var.step.curr == 'pick_items'">
        <div class="bg-[#f0f2f5] dark:bg-zinc-900 md:px-6 pb-6" v-if="!isOrder">
            <h1
                class="md:text-3xl md:mb-10 md:font-bold bg-white dark:bg-zinc-900 md:bg-transparent pl-4 md:pl-0 text-gray-900 dark:text-gray-100">
                Basket
                <sup class="font-normal md:text-[1rem] md:text-gray-500 dark:text-gray-400 ml-0.5">{{ items.length
                    }}</sup>
            </h1>

            <div class="flex flex-col md:flex-row gap-6">


                <BasketDetails v-bind="{
                    _ins: _ins,
                        _$p:_$p,
                        _p:_p,
                }" />


                <div ref="summaryEl">
                    <BasketSummary v-bind="{
                        _ins: _ins,
                        _$p:_$p,
                        _p:_p,
                    }" />
                </div>
            </div>

        </div>
    </div>



    <div v-if="_ins.var.step.curr == 'pick_address'">
        <div class="bg-[#f0f2f5] dark:bg-zinc-900 md:px-6 pb-6" v-if="!isOrder">
            <h1
                class="md:text-3xl md:mb-10 md:font-bold bg-white dark:bg-zinc-900 md:bg-transparent pl-4 md:pl-0 text-gray-900 dark:text-gray-100">
                Delivery Address
                <!--sup class="font-normal md:text-[1rem] md:text-gray-500 dark:text-gray-400 ml-0.5">{{ items.length
                    }}</sup-->
            </h1>

            <div class="flex flex-col md:flex-row gap-6">


                <Address v-bind="{
                    _ins: _ins,
                    _$p:_$p,
                    _p:_p,
                }" />


                <div ref="summaryEl">
                    <BasketSummary v-bind="{
                        _ins: _ins,
                        _$p:_$p,
                        _p:_p,
                    }" />
                </div>
            </div>

        </div>
    </div>




    <div v-if="_ins.var.step.curr=='place_order'">
        <Payment v-bind="{
            _ins: _ins,
            _$p: _$p,
            _p: _p,
        }" />
    </div>

    <!-- Mobile fixed checkout -->
    <div 
        class="fixed z-50 bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 p-4 shadow-t md:hidden flex justify-between items-center border-t border-gray-200 dark:border-zinc-700"
        v-show="showMobileSummary && !isOrder"
        >
        <div>
            <p class="text-sm font-semibold text-green-500 dark:text-green-400">
                {{ totalPayable }} {{ currency }} 
                <span class="font-normal">With Ozon Card</span>
            </p>
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {{ Math.round(totalPayable * 1.02) }} {{ currency }} 
                <span class="font-normal">Without Ozon Card</span>
            </p>
        </div>
        <button 
         @click="proceedToCheckout" 
         :disabled="selectedItems.length === 0 || _ins.var.btn.disable"
         class="bg-blue-500 dark:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg disabled:bg-blue-200 dark:disabled:bg-blue-900"
         >
            {{_ins.var.step.curr_data['btn'].txt}}
        </button>
    </div>

</template>



<script lang="ts" setup>
    import { ref, onMounted, computed, nextTick } from "vue"
    import type { _p_TYP, _$p_TYP } from "../shared/types";

    import  BasketDetails from "./src/components/BasketDetails.vue";
    import BasketSummary from "./src/components/BasketSummary.vue";
    import Payment from "./src/components/Payment.vue";

    import { useCart } from "./src/composable/useCart";
    import { useOrder } from "./src/contexts/useOrder";
import Address from "./src/components/Address.vue";

    const {_p,_$p} = defineProps<{
        _p:_p_TYP,
        _$p:_$p_TYP,
    }>();

    //set..
    const _ins = ref({
        var: {
            payload:{
                address:<any>{
                    address_id:"",//null,
                },
            },
            btn:{
                disable:false,
            },
            step:{
                curr:<any>null,
                curr_data:<any>null,
                l:{
                    pick_items:{
                        btn:{
                            txt:"Next"
                        }
                    },
                    pick_address:{
                        btn:{
                            txt:"Place order"
                        }

                    },
                    place_order:{
                        btn:{
                            txt:"Proceed to checkout"
                        }
                    },
                }
            }
        },
        fn:{
            set_step:async(_v:{name:string})=>{
                _ins.value.var.step.curr = _v.name;
                const _o:any = _ins.value.var.step;
                _ins.value.var.step.curr_data = _o.l[_v.name];
            },
        }
    });
    //set..
    _ins.value.fn.set_step({
        "name": "pick_items",//"pick_items", "pick_address"
    });
    
    // console.log(_$p.data.curr.data.theme);
 
    const { items, totalPayable, currency, submit, proceedToCheckout, selectedItems, } = useCart({_ins:_ins,_$p:_$p,_p:_p});

    onMounted(async () => {
      await submit()
      console.log("items", items.value);
    })
    

    // Mobile view show sticky, procced button
    const summaryEl = ref<HTMLElement | null>(null);
    const showMobileSummary = ref(false)

    onMounted(() => {
        nextTick(() => {
        if (!summaryEl.value) return;
        const observer = new IntersectionObserver(
            ([entry]) => (showMobileSummary.value = !entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(summaryEl.value);
        });
    });
   
    const { currentOrder } = useOrder(); 
    const isOrder = computed(() => !!currentOrder.value);
     
    // theme listener 
    (async () => {
       _p.f.listen("msg", async (_$) => {    
        if(_$.type === 'theme:change'){
          const theme = _$.custom?.theme;
          if (theme === 'dark' ) document.documentElement.classList.add('dark' );
          else document.documentElement.classList.remove('dark');
        }
       })
    })();
</script>
