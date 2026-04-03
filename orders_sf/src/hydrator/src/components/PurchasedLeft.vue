<template>
  <div class="flex flex-1 flex-col gap-4 pb-24">
    <!-- Search header with linear background -->
    <div class="max-w-7xl mx-auto w-full bg-white dark:bg-zinc-800 flex items-center gap-2 md:rounded-2xl rounded-b-2xl p-4">
      <div class="relative flex items-center gap-3 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-zinc-700/50 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-zinc-900/50 p-3 flex-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-violet-500 dark:text-violet-400 shrink-0">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

        <input 
          v-model="search"
          type="search"
          placeholder="Search by name, brand, or order ID..."
          class="w-full bg-transparent outline-none focus:outline-none focus:ring-0 border-0 text-zinc-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500 text-sm [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden"
        >
      </div>
    </div>

    <!-- Main content -->
    <div class="px-4 max-w-7xl mx-auto w-full">
      <!-- Results count -->
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ filteredItemCount }} {{ filteredItemCount === 1 ? 'item' : 'items' }} found
        </p>
        <!-- Active filters indicator -->
        <div v-if="search" class="flex items-center gap-2">
          <span class="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
            "{{ search }}"
          </span>
        </div>
      </div>
      
      <!--DELIVERED ITEMS RENDER-->
      <div 
        v-if="filteredItemCount"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
      >
          <div
              v-for="item in filteredItems"
              :key="item.order_item_id"
              class="group bg-white dark:bg-zinc-800 rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-700/50 hover:border-violet-200 dark:hover:border-violet-800/50 hover:shadow-xl hover:shadow-violet-500/5 dark:hover:shadow-violet-500/10 transition-all duration-300"
            >
            <!-- Image Container -->
            <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-900">
              <img
                :src="item.reference_data?.variant_product_data?.image_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFQ9R610Iu99YAHXjw6QLrvHwX42iWY_NwAA&s'"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              <!-- Return Status Badge -->
              <div 
                v-if="item.return_status !== 'none'"
                class="absolute top-2 left-2 z-10"
              >
                <span 
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-md shadow-lg"
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
                  {{ item.return_status.charAt(0).toUpperCase() + item.return_status.slice(1) }}
                </span>
              </div>

              <!-- Brand Badge -->
              <div class="absolute top-2 right-2 z-10">
                <span class="inline-block px-2 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-xs font-medium text-gray-700 dark:text-gray-300 rounded-lg shadow-lg">
                  {{ item.reference_data?.product_data?.brand || 'Brand' }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-3 md:p-4">
              <!-- Price and Currency -->
              <div class="flex items-baseline gap-1 mb-1">
                <span class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ new Intl.NumberFormat('en-IN', { style: 'currency', currency: item.currency, minimumFractionDigits: 0 }).format(item.payable_price) }}
                </span>
                <span class="text-xs text-gray-400 line-through">
                  {{ new Intl.NumberFormat('en-IN', { style: 'currency', currency: item.currency, minimumFractionDigits: 0 }).format(item.reference_data?.variant_product_data?.mrp || item.price) }}
                </span>
              </div>

              <!-- Product Name -->
              <h3 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 min-h-10">
                {{ item.name }}
              </h3>

              <!-- Delivery/Return Info -->
              <div class="space-y-1 mb-3">
                <div class="flex items-center gap-1 text-xs">
                  <span class="text-violet-600 dark:text-violet-400 font-medium capitalize">{{ item.order_status }}</span>
                  <span class="text-gray-400">•</span>
                  <span class="text-gray-500 dark:text-gray-400">
                    {{ new Date(item.delivered_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).toLowerCase()
                    }}
                  </span>
                </div>
                
                <div v-if="item.return_status !== 'none' && item.returned_at" class="flex items-center gap-1 text-xs">
                  <span class="text-gray-500 dark:text-gray-400">Returned:</span>
                  <span class="text-gray-700 dark:text-gray-300">
                    {{ new Date(item.returned_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).toLowerCase()
                    }}
                  </span>
                </div>
              </div>

              <!-- Rating Stars -->
              <div class="flex items-center gap-0.5 mb-3">
                <svg
                  v-for="i in 5"
                  :key="i"
                  viewBox="0 0 24 24"
                  class="size-4 transition-colors"
                  :class="i <= (item.review?.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                  fill="currentColor"
                >
                  <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11a.56.56 0 0 0 .47.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.38a.56.56 0 0 1-.84.61L12 17.65a.56.56 0 0 0-.58 0l-4.73 2.89a.56.56 0 0 1-.84-.61l1.28-5.38a.56.56 0 0 0-.18-.56L2.74 10.4a.56.56 0 0 1 .32-.99l5.52-.44a.56.56 0 0 0 .47-.35L11.48 3.5Z"/>
                </svg>
                <span v-if="item.review?.rating" class="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  ({{ item.review.rating }})
                </span>
              </div>

              <!-- Similar Items Button -->
              <button
                @click="similarItem"
                class="w-full bg-linear-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl py-2.5 text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-violet-500/25"
              >
                Find Similar
              </button>
            </div>
          </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div class="w-24 h-24 mb-4 text-gray-300 dark:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No items found</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {{ search ? `No results found for "${search}". Try different keywords.` : 'No delivered items available at the moment.' }}
        </p>
        <button 
          v-if="search"
          @click="search = ''"
          class="mt-4 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
        >
          Clear search
        </button>
      </div>
    </div>
  </div>
  

  <!-- Floating Filter Bar - Updated Modern Design -->
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
    <div class="flex items-center gap-1 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-zinc-700/50 rounded-2xl shadow-2xl shadow-violet-500/10 dark:shadow-black/30 p-1">
      <!-- Price Sort -->
      <button 
        @click="activeFilter = activeFilter === 'price' ? null : 'price'"
        class="relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group"
        :class="activeFilter === 'price' 
          ? 'bg-linear-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25' 
          : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'"
        title="Sort by price"
      >
        <!-- Icon with animation -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="size-5 transition-all duration-300 group-hover:scale-110"
          :class="activeFilter === 'price' ? 'text-white' : 'text-violet-500'"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
        
        <span class="text-sm font-medium">Price</span>
        
        <!-- Active indicator dot -->
        <span v-if="sortType === 'price' && activeFilter !== 'price'" 
          class="absolute -top-1 -right-1 size-2 bg-violet-500 rounded-full animate-pulse"></span>
      </button>
      
      <div class="w-px h-6 bg-linear-to-b from-transparent via-gray-300 dark:via-zinc-600 to-transparent"></div>
      
      <!-- Status Sort -->
      <button 
        @click="activeFilter = activeFilter === 'status' ? null : 'status'"
        class="relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group"
        :class="activeFilter === 'status' 
          ? 'bg-linear-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25' 
          : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'"
        title="Filter by status"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="size-5 transition-all duration-300 group-hover:scale-110"
          :class="activeFilter === 'status' ? 'text-white' : 'text-violet-500'"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
        
        <span class="text-sm font-medium">Status</span>
        
        <!-- Active indicator for status filter -->
        <span v-if="statusFilter !== 'all' && activeFilter !== 'status'" 
          class="absolute -top-1 -right-1 size-2 bg-violet-500 rounded-full animate-pulse"></span>
      </button>
      
      <div class="w-px h-6 bg-linear-to-b from-transparent via-gray-300 dark:via-zinc-600 to-transparent"></div>
      
      <!-- Date Sort -->
      <button 
        @click="activeFilter = activeFilter === 'date' ? null : 'date'"
        class="relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group"
        :class="activeFilter === 'date' 
          ? 'bg-linear-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25' 
          : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'"
        title="Sort by date"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="size-5 transition-all duration-300 group-hover:scale-110"
          :class="activeFilter === 'date' ? 'text-white' : 'text-violet-500'"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        
        <span class="text-sm font-medium">Date</span>
        
        <!-- Active indicator for date sort -->
        <span v-if="sortType === 'date' && activeFilter !== 'date'" 
          class="absolute -top-1 -right-1 size-2 bg-violet-500 rounded-full animate-pulse"></span>
      </button>
    </div>
  </div>

  <!-- Filter Options Panel - Updated Modern Design -->
  <div 
    v-if="activeFilter"
    class="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-64 animate-in fade-in slide-in-from-bottom-4 duration-300"
  >
    <div class="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-zinc-700/50 rounded-2xl shadow-2xl shadow-violet-500/10 dark:shadow-black/30 overflow-hidden">
      
      <!-- Panel Header -->
      <div class="px-4 py-3 border-b border-gray-100 dark:border-zinc-700/50">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-violet-500"></span>
          {{ activeFilter === 'price' ? 'Sort by Price' : activeFilter === 'status' ? 'Filter by Status' : 'Sort by Date' }}
        </h3>
      </div>

      <!-- PRICE OPTIONS -->
      <div v-if="activeFilter === 'price'" class="p-2">
        <button 
          @click="sortType='price'; priceOrder='asc'; activeFilter=null" 
          class="w-full text-left px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group"
          :class="sortType === 'price' && priceOrder === 'asc' ? 'bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50' : ''"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-linear-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-violet-600 dark:text-violet-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Price Low → High</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Lowest price first</p>
              </div>
            </div>
            <div v-if="sortType === 'price' && priceOrder === 'asc'" class="size-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </button>

        <button 
          @click="sortType='price'; priceOrder='desc'; activeFilter=null" 
          class="w-full text-left px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group mt-1"
          :class="sortType === 'price' && priceOrder === 'desc' ? 'bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50' : ''"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-linear-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-violet-600 dark:text-violet-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25M21 15.75L17.25 12m0 0L21 8.25M17.25 12h-12" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Price High → Low</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Highest price first</p>
              </div>
            </div>
            <div v-if="sortType === 'price' && priceOrder === 'desc'" class="size-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <!-- STATUS OPTIONS -->
      <div v-if="activeFilter === 'status'" class="p-2">
        <button 
          @click="statusFilter='all'; activeFilter=null" 
          class="w-full text-left px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group"
          :class="statusFilter === 'all' ? 'bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50' : ''"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-linear-to-br from-gray-500/10 to-gray-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-gray-600 dark:text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">All Items</span>
            </div>
            <div v-if="statusFilter === 'all'" class="size-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </button>

        <button 
          @click="statusFilter='delivered'; activeFilter=null" 
          class="w-full text-left px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group mt-1"
          :class="statusFilter === 'delivered' ? 'bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50' : ''"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-linear-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-green-600 dark:text-green-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Delivered</span>
            </div>
            <div v-if="statusFilter === 'delivered'" class="size-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </button>

        <button 
          @click="statusFilter='cancelled'; activeFilter=null" 
          class="w-full text-left px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group mt-1"
          :class="statusFilter === 'cancelled' ? 'bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50' : ''"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-linear-to-br from-red-500/10 to-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-red-600 dark:text-red-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Cancelled</span>
            </div>
            <div v-if="statusFilter === 'cancelled'" class="size-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </button>

        <button 
          @click="statusFilter='returned'; activeFilter=null" 
          class="w-full text-left px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group mt-1"
          :class="statusFilter === 'returned' ? 'bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50' : ''"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-linear-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-blue-600 dark:text-blue-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-white">Returned</span>
            </div>
            <div v-if="statusFilter === 'returned'" class="size-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <!-- DATE OPTIONS -->
      <div v-if="activeFilter === 'date'" class="p-2">
        <button 
          @click="sortType='date'; dateOrder='newest'; activeFilter=null" 
          class="w-full text-left px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group"
          :class="sortType === 'date' && dateOrder === 'newest' ? 'bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50' : ''"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-linear-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-violet-600 dark:text-violet-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0-6-6m6 6 6-6" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Newest First</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Most recent deliveries</p>
              </div>
            </div>
            <div v-if="sortType === 'date' && dateOrder === 'newest'" class="size-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </button>

        <button 
          @click="sortType='date'; dateOrder='oldest'; activeFilter=null" 
          class="w-full text-left px-4 py-3 rounded-xl hover:bg-linear-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all duration-200 group mt-1"
          :class="sortType === 'date' && dateOrder === 'oldest' ? 'bg-linear-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50' : ''"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-linear-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-violet-600 dark:text-violet-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0 6-6m-6 6-6-6" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Oldest First</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Earliest deliveries</p>
              </div>
            </div>
            <div v-if="sortType === 'date' && dateOrder === 'oldest'" class="size-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-3 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { useOrder } from "../composable/useOrder";

  const { deliveredOrder } = useOrder();
  const similarItem = () => alert('Redirecting to similar items...');

  // Sort functions (to be implemented)
  const sortType = ref(null) // price | date
  const activeFilter = ref(null) // price | status | date
  const priceOrder = ref('asc') // asc | desc
  const statusFilter = ref('all') // delivered | cancelled | returned
  const dateOrder = ref('newest') // newest | oldest
  const search = ref('');

  // Total filtered items count
  const filteredItemCount = computed(() => filteredItems.value.length)

  const filteredItems = computed(() => {
    const q = search.value.trim().toLowerCase()

    let items = deliveredOrder.value.flatMap(order =>
      order.items.map(item => ({
        ...item,
        order_id: order.order_id,
        currency: order.pricing.currency
      }))
    )

    // search
    if (q) {
      items = items.filter(item => {
        const brand = item.reference_data?.product_data?.brand?.toLowerCase() || ''
        const name = item.name?.toLowerCase() || ''
        const orderId = String(item.order_id)

        return name.includes(q) || brand.includes(q) || orderId === q
      })
    }

    // status filter
    if (statusFilter.value !== 'all') {
      items = items.filter(i => i.order_status === statusFilter.value)
    }

    // price sort
    if (sortType.value === 'price') {
      items.sort((a,b)=>
        priceOrder.value === 'asc'
          ? a.payable_price - b.payable_price
          : b.payable_price - a.payable_price
      )
    }

    // date sort
    if (sortType.value === 'date') {
      items.sort((a,b)=>{
        const d1 = new Date(a.delivered_at || a.created_at)
        const d2 = new Date(b.delivered_at || b.created_at)

        return dateOrder.value === 'newest' ? d2 - d1 : d1 - d2
      })
    }

    return items
  })
</script>