<template>
  <div class="max-w-2xl mx-auto dark:bg-zinc-900">

    <div v-if="bankAccounts.length >= 0 && !showForm">
      <div class="flex items-center justify-between my-4 bg-white dark:bg-zinc-800 p-2">
        <div>
          <p class="text-medium text-lg dark:text-white">Saved Bank Accounts</p>
          <p class="text-xs text-gray-400">Bank count: {{ bankAccounts.length }}</p>
        </div>
        <button
          @click="addBank"
          class="font-medium text-violet-500 p-2 border border-black/20 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-zinc-700">
          + ADD NEW BANK
        </button>
      </div>
    </div>

    <div v-if="bankAccounts.length > 0 && !showForm">
      <BankCard v-bind="{ _p:_p, __p:_$p }" />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import type { _p_TYP, _$p_TYP } from "../shared/types"

import BankCard from './src/components/BankCard.vue'
import { useBank } from './src/composables/useBank.ts'
import { createTemplate } from "bind-str"

const {_p, _$p} = defineProps<{
  _p:_p_TYP,
  _$p:_$p_TYP,
}>()

const { bankAccounts, getBanks, showForm } = useBank()

onMounted(() => getBanks())
watch(bankAccounts, v => console.log('bank updated:', v))

const addBank = () => {
  try {
    const _t = createTemplate(_$p.data.curr.data.event[`onClickAdd`])
    const _u = _t({})
    location.href = `${_u}`
  } catch (err) {
    console.log(`addBank err:${err}`)
  }
}

// theme listener
(async () => {
  _p.f.listen("msg", async (_$) => {
    if (_$.type === 'theme:change') {
      const theme = _$.custom?.theme
      theme === 'dark'
        ? document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark')
    }
  })
})()
</script>
