<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { createTemplate } from "bind-str";

const props = defineProps<{
  mode?: "sticky" | "normal"
  _$p?: any
}>();
const mode = computed(() => props.mode ?? "normal");

// VARIABLES
const allData = ref<any>(props._$p.data.curr.data.value.l || []);
const tabs = ref<any>([]);
const activeTab = ref("");
const displayedItems = computed(() => allData.value);

const page = ref<any>(1);
const totalPages = ref(1);
const isLoadingMore = ref(false);
const loadTrigger = ref<HTMLElement | null>(null);

// UTILS
watch(activeTab, (val) => {
  console.log("Active tab changed:", val);
  page.value = 1;
  fetchItems(false);
});

onMounted(() => {
  if (!loadTrigger.value) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && page.value < totalPages.value && !isLoadingMore.value) {
        page.value++;
        fetchItems(true); // append next page
        console.log("load_more")
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(loadTrigger.value);
});

// API,s
const fetchItems = async (append = false) => {
  const api = props._$p.data.curr.data.api;

  const _body_t = createTemplate(JSON.stringify(api.body),{open:"<",close:">"});
  const _binded_body = JSON.parse(_body_t({ page: page.value, tab_id: activeTab.value }));
  _binded_body.body.page = Number(_binded_body.body.page);

  console.log("binded body updated", _binded_body);
  isLoadingMore.value = true;

  try {
    const response = await fetch(api.url, {
      method: api.method,
      headers: api.headers,
      body: JSON.stringify(_binded_body),
    });

    const data = await response.json();
    totalPages.value = data.data.total_pages;

    allData.value = append
      ? [...allData.value, ...data.data.documents]
      : data.data.documents;

  } catch (error) {
    console.error('Error fetching items:', error);
  } finally {
    isLoadingMore.value = false;
  }
}

const fetchTabs = async () => {
  const api = props._$p.data.curr.data.tabs.api;
  
  try {
    const response = await fetch(api.url, {
      method: api.method,
      headers: api.headers,
      body: JSON.stringify(api.body),
    });
    const data = await response.json();

    const formattedTabs = Object.keys(data.data.facets.category).map(key => ({
      id: key,
      title: key.charAt(0).toUpperCase() + key.slice(1)
    }));
    tabs.value = formattedTabs;

    // set first tab as active
    if (formattedTabs.length) {
      activeTab.value = formattedTabs[0].id;
      page.value = 1;
      fetchItems(false);
    }
  } catch (error) {
    console.error('Error fetching tabs:', error);
  }
}
fetchTabs();




// LAYOUT
const calculateMobileLayout = (items: any[]) => {
  let pairIndex = 0;
  return items.map((item, index) => {
    let widthClass = '';
    if (item.full) {
      widthClass = 'w-full';
      pairIndex = 0;
    } else {
      const isStart = pairIndex % 2 === 0;
      const row = Math.floor(pairIndex / 2);
      widthClass = (row % 2 === 0)
        ? (isStart ? 'w-[calc(60%-0.375rem)]' : 'w-[calc(40%-0.375rem)]')
        : (isStart ? 'w-[calc(40%-0.375rem)]' : 'w-[calc(60%-0.375rem)]');
      pairIndex++;
    }
    // Mobile Height is Fixed per row type to keep it clean
    const heightClass = 'h-48 sm:h-56';
    return { ...item, mobileClass: widthClass, heightClass, globalIndex: index };
  });
};

const masonryColumns = computed(() => {
  const cols = [[], [], [], []] as any[][];
  
  // We process the raw displayedItems
  displayedItems.value.forEach((item : any, i : number) => {
    const colIndex = i % 4; // Distribute: 0, 1, 2, 3, 0...

    let hClass = '';
    const positionInCol = Math.floor(i / 4);

    if (colIndex % 2 === 0) {
       hClass = positionInCol % 2 === 0 ? 'h-[22rem]' : 'h-[28rem]';
    } else {
       hClass = positionInCol % 2 === 0 ? 'h-[28rem]' : 'h-[22rem]';
    }

    cols[colIndex].push({ 
        ...item, 
        pcHeight: hClass,
        globalIndex: i 
    });
  });
  
  return cols;
});

const mobileItems = computed(() => calculateMobileLayout(displayedItems.value));

</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-pink-500 selection:text-white">

    <nav :class="['bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all duration-300', mode === 'sticky' ? 'sticky top-0 z-50' : 'relative']">
      <div class="max-w-480 mx-auto px-4 md:px-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          <div class="overflow-x-auto no-scrollbar w-full flex md:justify-center">
            <div class="flex px-1 gap-4 md:gap-12 min-w-max md:min-w-0 md:justify-center">
              <button
                v-for="(tab, index) in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="relative cursor-pointer px-2 py-4 text-sm md:text-lg font-bold transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-lg"
                :class="activeTab === tab.id ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
              >
                {{ tab.title }}
                <span class="absolute bottom-2 left-0 w-full h-1 rounded-full transition-all duration-300 origin-center" :class="activeTab === tab.id ? 'bg-black dark:bg-white scale-x-100' : 'bg-transparent scale-x-0 group-hover:bg-gray-300 group-hover:scale-x-50'"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="px-3 py-4 md:px-8 md:py-10 max-w-480 mx-auto">
      
      <div class="flex flex-wrap gap-3 md:hidden bg-red-700">
        <TransitionGroup name="stagger">
          <div
            v-for="(item) in mobileItems"
            :key="item.id"
            class="relative group cursor-pointer overflow-hidden rounded-2xl
                   shadow-sm hover:shadow-2xl
                   bg-white dark:bg-gray-900
                   transition-all duration-500 ease-out hover:-translate-y-1"
            :class="[
              item.mobileClass,
              item.heightClass,
            ]"
          >
             <img :src="item.image" loading="lazy" class="absolute inset-0 w-full h-full object-cover" alt="Item" />
             <div class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
             <div class="absolute bottom-3 left-3 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg z-10">
                <span class="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">{{ item.title }}</span>
             </div>
          </div>
        </TransitionGroup>
      </div>


      <div class="hidden md:flex md:gap-6 items-start">
        
        <div v-for="(colItems, colIndex) in masonryColumns" :key="colIndex" class="flex-1 flex flex-col gap-6">
           <TransitionGroup name="stagger">
             <div
               v-for="(item) in colItems"
               :key="item.id"
               class="relative group cursor-pointer overflow-hidden rounded-3xl
                      shadow-sm hover:shadow-2xl
                      bg-white dark:bg-gray-900 w-full
                      transition-all duration-500 ease-out hover:-translate-y-1"
               :class="[
                 item.pcHeight,  // Zigzag Height (22rem or 28rem)
               ]"
             >
                <img 
                  :src="item.image" 
                  loading="lazy" 
                  class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                  alt="Item" 
                />
                
                <div class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                
                <div class="absolute bottom-5 left-5 bg-white/95 dark:bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg z-10 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                   <span class="text-xs font-bold uppercase tracking-widest">{{ item.title }}</span>
                </div>
             </div>
           </TransitionGroup>
        </div>

      </div>
      

      <!-- trigger loadmore -->
      <div ref="loadTrigger" class="h-1 w-full"></div>
    </main>
  </div>
</template>