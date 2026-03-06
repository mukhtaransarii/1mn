<template>
  <div class="min-h-screen bg-white text-slate-900 dark:bg-[#0b1120] dark:text-slate-100">    
    <header v-if="_$p.data.curr.data.mode=='normal'"
      class="sticky top-0 z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div class="max-w-360 mx-auto px-4 py-3 md:px-8 md:py-4 flex gap-4 items-center">
        
        <div class="flex-1 relative group" role="search">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          
          <input 
            id="site-search"
            v-model="query" 
            @keyup.enter="handleSearch" 
            type="text" 
            placeholder="Search premium brands, styles..." 
            class="w-full h-11 md:h-12 pl-12 pr-10 bg-gray-100 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 rounded-2xl text-[15px] outline-none transition-all duration-200 placeholder:text-slate-400 dark:text-white shadow-sm"
          />
          
          <button v-if="query" class="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-slate-700 text-slate-500 hover:text-red-500 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors" @click="clearSearch">✕</button>
        </div>
        
        <button :disabled="!query.trim()" class="hidden md:block disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 active:scale-95 transition-all" @click="handleSearch">
          SEARCH
        </button>

        <button @click="props.toggleTheme" class="p-3 rounded-2xl bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors active:scale-95">
          <svg v-if="!props.isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
        </button>
      </div>
    </header>
    
    <div v-if="products.length > 0" class="max-w-360 mx-auto px-4 md:px-8 py-1 space-y-4">
      <h2 v-if="props._$p.data.curr.data.title" :class="props._$p.data.curr.data.title.class">{{ props._$p.data.curr.data.title.value }}</h2>

      <ul ref="listContainer"
         :class="props._$p.data.curr.data.oriantation === 'v'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 list-none'
            : 'flex gap-3 overflow-x-auto py-2 list-none'"
      >
        <li 
          v-for="(item, index) in products" 
          :key="item.slug + index" 
          class="group shrink-0 w-60 md:w-65 bg-white dark:bg-[#1e293b] rounded-2xl flex flex-col relative cursor-pointer border border-transparent hover:border-blue-100 dark:hover:border-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300"
           @click="goToProduct(item)"
        >
          
          <div class="p-2 md:p-2.5 pb-0">
            <div class="aspect-4/5 relative bg-[#f4f6f8] dark:bg-slate-800 rounded-xl overflow-hidden">
              <img 
                
                :src="getImage(item)" 
                loading="lazy" 
                :alt="item.title"
                @error="handleImageError"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal" 
              />
              
              <span v-if="item.variant_mrp[0] > item.variant_prices[0]" class="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] md:text-xs px-2 py-0.5 rounded-md font-bold shadow-sm">
                -{{Math.round(((item.variant_mrp[0] - item.variant_prices[0]) / item.variant_mrp[0]) * 100)}}%
              </span>

              <button 
                class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all scale-0 group-hover:scale-100"
                @click.stop="toggleWishlist"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>

          <div class="p-3 md:p-4 flex flex-col flex-1 gap-1">
            
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-none">
                {{ new Intl.NumberFormat('ru-RU').format(item.variant_prices[0]) }} ₽
              </span>
              <span v-if="item.variant_mrp[0] > item.variant_prices[0]" class="text-xs text-slate-400 line-through decoration-slate-400/50">
                {{ new Intl.NumberFormat('ru-RU').format(item.variant_mrp[0]) }}
              </span>
            </div>

            <div class="flex items-center gap-2 mb-1.5">
              <span class="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <span class="w-1 h-1 rounded-full bg-green-500"></span> Ozon Card
              </span>
              <div class="flex items-center gap-1 text-[10px] text-slate-400">
                <span class="text-amber-400">★</span> 4.9 (128)
              </div>
            </div>

            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{{ item.brand }}</div>
            <h3 class="text-[13px] leading-snug text-slate-700 dark:text-slate-300 font-medium line-clamp-2 min-h-[2.5em]">
              {{ item.title }}
            </h3>

            <button 
              class="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
              @click.stop="addToCart(item)"
            >
              <span>Add to Cart</span>
              <svg class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </li>

        <li
          ref="loadTrigger"
          :class="props._$p.data.curr.data.oriantation === 'h'
            ? 'group shrink-0 w-60 md:w-65 bg-white dark:bg-[#1e293b] rounded-2xl flex items-center justify-center border border-transparent'
            : 'col-span-full h-20 flex justify-center items-center w-full'"
        >
          <div v-if="isLoadingMore" class="flex gap-2">
            <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
        </li>
       </ul>
    </div>

    <div v-else-if="loading && query.trim()" class="max-w-360 mx-auto px-4 md:px-8 py-4 space-y-4">
        <!-- Title skeleton -->
        <div v-if="props._$p.data.curr.data.title"
            class="h-8 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse">
        </div>

        <!-- Cards skeleton -->
        <div :class="props._$p.data.curr.data.oriantation === 'h' 
            ? 'flex gap-3 overflow-x-auto py-2'
            : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'">

          <div v-for="n in 10"
              :key="n"
              class="shrink-0 w-60 md:w-65 bg-white dark:bg-[#1e293b] rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-slate-800">

            <div class="aspect-4/5 bg-gray-200 dark:bg-slate-700 rounded-xl mb-3 animate-pulse"></div>

            <div class="space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
              <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
              <div class="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg mt-2 animate-pulse"></div>
            </div>

          </div>
        </div>
      </div>

    <div v-else class="flex flex-col items-center justify-center py-20 px-4">
      <div class="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4">🔍</div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
      <p class="text-slate-500 mb-6 text-center max-w-md">We couldn't find anything matching your search. Try checking for typos or use broader keywords.</p>
      <button class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors" @click="query = ''">Clear Filters</button>
    </div>
  </div>

  <ContentEngine ref="cartPopupRef"
    v-bind="{ce_file:_var.cart_popup.ce_file}" 
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import ContentEngine from './ContentEngine.vue';
import { createTemplate } from "bind-str";

//set..
const props = defineProps<{
  _p: any
  _$p: any
  _$cb: any
  toggleTheme: () => void
  isDark: any
}>();


// VARIABLES
const staticProducts = props._$p.data.curr.data.value.l || [];
const products = ref<any[]>([...staticProducts]);
const loading = ref(false);  
const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500';
const cartPopupRef:any = ref(null);

const page = ref(1);
const query = ref('nike');
const totalPages = ref(1);
const isLoadingMore = ref(false);
const loadTrigger = ref<HTMLElement | null>(null);
const listContainer = ref<HTMLElement | null>(null);


// API's
const fetchProducts = async (append = false) => {
  if (page.value > totalPages.value) return;

  const api = props._$p.data.curr.data.api;

  const _body_t = createTemplate(JSON.stringify(api.body),{open:"<",close:">"});
  const _binded_body = JSON.parse(_body_t({ page: page.value, q: query.value }));
  _binded_body.page = Number(_binded_body.page);

  console.log("binded body updated", _binded_body);
  
  if(!query.value.trim()) return console.warn("Please enter a search query.");

  try {
    if (append) {
      isLoadingMore.value = true;
    } else {
      loading.value = true;
    }

    const response = await fetch(api.url, {
      method: api.method,
      headers: api.headers,
      body: JSON.stringify(_binded_body),
    });

    const data = await response.json();
    totalPages.value = data.data.total_pages;

    const apiProducts = data.data.products || [];

    if (page.value === 1) {
      if (query.value.trim()) {
        products.value = apiProducts;
      } else {
        products.value = [...staticProducts, ...apiProducts];
      }
    } else {
      products.value = [...products.value, ...apiProducts];
    }

  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
    isLoadingMore.value = false;
  }
};

// UTILS

// onMounted(() => {
//   const isHorizontal = props._$p.data.curr.data.oriantation === 'h';

//   // 🔹 HORIZONTAL SCROLL LOAD
//   if (isHorizontal && listContainer.value) {
//     listContainer.value.addEventListener('scroll', () => {
//       const el = listContainer.value!;
//       const isAtRight =
//         el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

//       if (
//         isAtRight &&
//         page.value < totalPages.value &&
//         !isLoadingMore.value &&
//         !loading.value
//       ) {
//         page.value++;
//         fetchProducts(true);
//       }
//     });
//   }

//   // 🔹 VERTICAL LOAD (IntersectionObserver)
//   if (!isHorizontal && loadTrigger.value) {
//     const observer = new IntersectionObserver((entries) => {
//       if (
//         entries[0].isIntersecting &&
//         page.value < totalPages.value &&
//         !isLoadingMore.value &&
//         !loading.value
//       ) {
//         page.value++;
//         fetchProducts(true);
//       }
//     }, { threshold: 0.5 });

//     observer.observe(loadTrigger.value);
//   }
// });

let observer: IntersectionObserver | null = null;

const setupLoadMore = async () => {
  await nextTick();

  const isH = props._$p.data.curr.data.oriantation === 'h';

  observer?.disconnect();
  if (listContainer.value) listContainer.value.onscroll = null;

  if (isH && listContainer.value) {
    listContainer.value.onscroll = () => {
      const el = listContainer.value!;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10 &&
          page.value < totalPages.value &&
          !loading.value &&
          !isLoadingMore.value) {
        page.value++;
        fetchProducts(true);
      }
    };
  }

  if (!isH && loadTrigger.value) {
    observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting &&
          page.value < totalPages.value &&
          !loading.value &&
          !isLoadingMore.value) {
        page.value++;
        fetchProducts(true);
      }
    }, { threshold: 0.1 });

    observer.observe(loadTrigger.value);
  }
};

onMounted(setupLoadMore);
watch(products, setupLoadMore);

const _var = ref({
  cart_popup: {
    ce_file: props._$p.data.curr.data.cart_popup[`ce_file`]
  }
});

const handleSearch = async () => {
  page.value = 1;
  totalPages.value = 1;

  // Reset products correctly
  if (!query.value.trim()) {
    products.value = [...staticProducts];
  } else {
    products.value = [];
  }

  await fetchProducts(false);
};

const clearSearch = () => {
  query.value = '';
  document.getElementById('site-search')?.focus();
  handleSearch(); 
};

const getImage = (item: any) => {
  try {
    const meta = item.metadata;
    if (meta.color?.[0]?.image?.[0]?.url && !meta.color[0].image[0].url.includes('example')) {
      return meta.color[0].image[0].url;
    }
  } catch (e) { }
  
  const title = item.title ? item.title.toLowerCase() : '';
  
  if (title.includes('dress')) return `https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500`;
  if (title.includes('shirt') || title.includes('top')) return `https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500`;
  if (title.includes('shoe') || title.includes('sneaker')) return `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500`;
  if (title.includes('bag')) return `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500`;
  
  return FALLBACK_IMAGE_URL;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  if (img.src !== FALLBACK_IMAGE_URL) {
    img.src = FALLBACK_IMAGE_URL;
  }
};

const goToProduct = (v: any) => {
  if (!v.slug && !v.id) return;

  const _t = createTemplate(props._$p.data.curr.data.event.onProductClick);
  const _u = _t({
    id: v.id,
    slug: v.slug,
  });
  location.href = _u;
  
};

const addToCart = (_v:any) => {
  cartPopupRef.value.ce_call("msg", {
    type: "product:open",
    custom: { 
        product_id: _v.slug,
    },
    _p: {}, 
    _$p: {} 
  });

};

const toggleWishlist = (e: Event) => {
  const btn = e.currentTarget as HTMLElement;
  btn.classList.toggle('text-red-500');
  btn.classList.toggle('bg-red-50');
};
</script>
