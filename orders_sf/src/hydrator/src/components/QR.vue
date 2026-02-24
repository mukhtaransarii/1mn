<template>
  <div class="md:w-[50vw] bg-white dark:bg-zinc-700 flex md:flex-row flex-col items-center gap-4 rounded-2xl p-6 shadow-lg">
    <!-- Code display with better emphasis -->
    <div class="flex-1 w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 text-center mb-2">
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
        Show the QR code or tell the code at the pickup point to pick up your order
      </p>
    
      <div class="text-2xl font-bold tracking-widest text-violet-600 dark:text-violet-400">
        354955
      </div>
    </div>

    <!-- OR separator -->
    <div class="md:hidden flex items-center w-full my-2">
      <div class="flex-grow border-t border-zinc-300 dark:border-zinc-600"></div>
      <span class="px-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">OR</span>
      <div class="flex-grow border-t border-zinc-300 dark:border-zinc-600"></div>
    </div>

    <!-- QR Code section -->
    <div class="text-center p-4">
      <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
        Show QR to pickup piont
      </p>
      <div class="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-inner">
        <img src="/qr_black.png" class="block dark:hidden md:w-40 md:h-40" alt="QR Code for pickup" />
        <img src="/qr_white.png" class="hidden dark:block md:w-40 md:h-40" alt="QR Code for pickup" />
      </div>
    </div>
  </div>
</template>