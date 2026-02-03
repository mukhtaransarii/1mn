<template>
  <aside
    class="md:w-64 w-full self-start md:bg-white md:dark:bg-zinc-800 rounded-xl md:p-4 md:space-y-6">

    <!-- profile info -->
    <div class="flex items-center justify-between gap-3 px-4 md:p-0"
     :class="setMenu.value !== 'Home' ? 'hidden md:block': 'block'"
    >
      <div class="flex flex-row flex-1 items-center  gap-2 bg-white dark:bg-zinc-800 md:bg-transparent rounded-full p-1 md:p-0 md:rounded-none">
        <img src="https://i.pinimg.com/736x/82/85/96/828596ef925a10e8c1a76d3a3be1d3e5.jpg" alt="Profile" class="w-10 h-10 rounded-full">
        <div>
          <p class="text-sm  dark:text-zinc-200 font-semibold leading-none">John Doe</p>
          <p class="text-sm text-gray-500 hidden md:block">john.doe@example.com</p>
          <p class="text-sm text-gray-500 md:hidden">go to profile</p>
        </div>
      </div>
      
      <svg @click="set_page='MESSAGE'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 md:hidden block dark:text-white">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>

      <svg @click="isMenuOpen = !isMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 md:hidden block dark:text-white">
        <path v-show="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        <path v-show="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </div>

    <div class="md:hidden mt-2 bg-white dark:bg-zinc-800 dark:text-white p-4 rounded-xl flex items-center gap-4"
     :class="setMenu.value !== 'Home' ? 'hidden md:block': 'block'"
    > 
       <div class="bg-gray-100 dark:bg-zinc-700 p-2 rounded-lg w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <p class="text-xs font-semibold">Favorites</p>
          <p class="text-xs text-gray-500">1 product</p>
       </div>

       <div class="bg-gray-100 dark:bg-zinc-700 p-2 rounded-lg w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>

          <p class="text-xs font-semibold">History</p>
          <p class="text-xs text-gray-500">Order again</p>
       </div>

       <div class="bg-gray-100 dark:bg-zinc-700 p-2 rounded-lg w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>

          <p class="text-xs font-semibold">Reviews</p>
          <p class="text-xs text-gray-500">No items</p>
       </div>
    </div>
    
    <div class="fixed inset-x-0 bottom-0 z-40 bg-[#f0f2f5] dark:bg-zinc-900 
         space-y-1 md:space-y-6 md:bg-transparent md:dark:bg-transparent
         transition-transform duration-300 ease-in-out
         md:static md:translate-y-0 md:block
         rounded-t-2xl "  
        :class="isMenuOpen ? 'translate-y-0' : 'translate-y-full'"
    >
      <div v-for="(section, index) in menuSections" :key="section.title" class="rounded-2xl bg-white dark:bg-zinc-800 md:block px-3 md:px-0">
        <div v-if="index === 0" class="md:hidden px-3 py-2 text-xl font-semibold dark:text-white flex justify-between items-center">
          <p>Menu</p>

          <svg @click="isMenuOpen = false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>

        <!-- Title -->
        <div v-if="section.title" class="hidden md:block px-3 text-sm font-semibold text-gray-900 dark:text-zinc-200">
          {{ section.title }}
        </div>

        <!-- Items -->
        <ul>
          <li
            @click="setMenuHandle(item); isMenuOpen = false"
            v-for="item in section.items"
            :key="item.label"
            class="flex items-center justify-between px-3 py-2 md:border-0 border-b border-[#f0f2f5] dark:border-zinc-900  md:rounded-lg cursor-pointer text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
            :class="itemIsSelected(item) ? 'md:bg-gray-100 md:dark:bg-zinc-700' : ''"
          >

            <span>{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="text-xs bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 px-2 rounded"
            >
              {{ item.badge }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>


<script setup lang="ts">
  import { ref } from 'vue';
  import { useSideBar } from '../composables/useSideBar';
  import { usePages } from '../composables/usePages.ts';
  
  const { setMenu } = useSideBar();
  const { set_page } = usePages();
  
  const isMenuOpen = ref(false)
  const setMenuHandle = (item: any) => {
    if (item.type === 'Fragments') {
      // store in global state
      setMenu.value = { label: item.label, value: item.value, type: item.type }
      console.log('Set menu to fragment:', setMenu.value);
    } else if (item.type === 'Routes') {
      // router.push('/' + value) // redirect for routes
      console.log('Navigate to route:', item);
    } else if (item.type === 'Settings') {
      // optional: handle settings or fallback
      console.log('Set menu to settings:', item);
    }
  }

  // helper to check if item is currently selected
  const itemIsSelected = (item: any) => {
    return setMenu.value?.label === item.label
  }

  const menuSections = [
    {
      title: 'Personal information',
      items: [
        { label: 'Edit Profile', value: 'EditProfile', type: 'Fragments' },
        { label: 'Home', value: 'Home', type: 'Fragments' },
        { label: 'Orders', value: 'Orders', type: 'Fragments' },
        { label: 'Returns', value: 'Returns', type: 'Fragments' },
        { label: 'Purchased goods', value: 'PurchasedGoods', type: 'Fragments' },
        { label: 'Featured stores and brands', value: 'Brands', type: 'Fragments' },
        { label: 'Tickets, hotels and tours', value: 'Travel', type: 'Fragments' }
      ]
    },
    {
      title: 'Finance & activity',
      items: [
        { label: 'Reviews', value: 'reviews', type: 'Routes' },
        { label: 'Codes and certificates', value: 'codes', type: 'Routes' },
        { label: 'Balance of funds', value: 'balance', type: 'Routes' },
        { label: 'Ozon Premium', value: 'premium', type: 'Routes' },
        { label: 'Procurement for business', value: 'business', type: 'Routes' },
        { label: 'My questions and answers', value: 'qa', type: 'Routes' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Settings', value: 'settings', type: 'Settings' },
        { label: 'Vacancies', value: 'vacancies', type: 'Settings' },
        { label: 'Language', value: 'Language', type: 'Settings' },
        { label: 'Currency', value: 'Currency', type: 'Settings', badge: 'RUB' }
      ]
    }
  ]

</script>
