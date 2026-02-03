<template>
  <!-- Finance card -->
  <div class="md:bg-white dark:md:bg-zinc-800 rounded-xl md:p-4">
    <!-- Banner -->
    <img
      src="https://ir.ozone.ru/s3/cms/83/t9d/wc2400/1175_155_2_1.png"
      alt="banner"
      class="w-full h-auto rounded-lg bg-white dark:bg-zinc-800 p-3 md:p-4"
    />

    <p class="text-lg font-semibold mt-6 hidden md:block
              text-zinc-900 dark:text-zinc-100">
      My Finance
    </p>

    <!-- Card -->
    <div
      class="bg-white md:dark:bg-zinc-700 dark:bg-zinc-800 rounded-xl p-4 md:shadow-lg
             flex items-center justify-between gap-4
             mt-4 w-full md:w-fit"
    >
      <div>
        <p class="font-semibold text-base md:text-lg
                  text-zinc-900 dark:text-zinc-100">
          Ozon Card
        </p>

        <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
          Get unique discounts for your purchases
        </p>

        <button
          class="bg-blue-500 hover:bg-blue-600
                 px-3 py-1.5 rounded-xl
                 text-white text-sm mt-2"
        >
          Open map
        </button>
      </div>

      <img
        src="https://ir.ozone.ru/s3/ob-loader/wallet/wc2400/Coin_fill2.png"
        alt="coin"
        class="w-16 md:w-40 h-auto rounded-lg"
      />
    </div>

    <!-- Info box -->
    <div
      class="bg-zinc-100 dark:bg-zinc-800 rounded-xl
             p-4 mt-4 flex flex-col gap-1"
    >
      <p class="text-zinc-500 dark:text-zinc-400 text-xs">
        Ozon uses recommendation technologies
      </p>
      <p class="text-blue-500 text-xs cursor-pointer">
        Read More
      </p>
    </div>
  </div>

  <!-- Products -->
  <div class="bg-white dark:bg-zinc-800 rounded-xl p-4 mt-4">
    <p class="text-xl md:text-2xl font-bold
              text-zinc-900 dark:text-zinc-100">
      You might also like
    </p>

    <!-- Skeleton grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      <div
        v-for="n in 6"
        :key="n"
        class="bg-white dark:bg-zinc-800 rounded-xl p-3
               shadow animate-pulse"
      >
        <!-- image skeleton -->
        <div
          class="bg-zinc-200 dark:bg-zinc-700
                 rounded-lg h-48 md:h-48 w-full"
        ></div>

        <!-- text skeleton -->
        <div class="mt-3 space-y-2">
          <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full"></div>
          <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3"></div>
          <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
          <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  </div>
</template>
