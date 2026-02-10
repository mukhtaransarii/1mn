<template>
  <div
    v-for="bank in bankAccounts"
    :key="bank.account_id"
    class="shadow-md pt-4 bg-white dark:bg-zinc-800"
  >
    <Tag :class="_$p.data.curr.data.mode=='picker' ? `block cursor-pointer` : ``">

      <div class="flex">

        <div v-if="_$p.data.curr.data.mode=='picker'" class="pl-2">
          <input type="radio" name="bank"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            @click="() => _pick(bank)"
          />
        </div>

        <div class="w-full">
          <div class="flex items-center justify-between px-4">
            <p class="font-medium text-sm dark:text-white">{{ bank.holder_name }}</p>
            <p class="font-medium text-sm dark:text-white">{{ bank.ifsc_code }}</p>
          </div>

          <div class="text-sm mt-2 text-light text-gray-500 px-4">
            <p>Account No: {{ bank.account_number }}</p>
            <p>UPI ID: {{ bank.upi_id }}</p>
            <p>Country: {{ bank.country }}</p>
          </div>
        </div>

      </div>

      <div v-if="_$p.data.curr.data.mode=='normal'"
        class="flex justify-between items-center border-t border-black/20 mt-2">
        <button
          @click="editBank(bank)"
          class="font-medium text-violet-500 flex-1 hover:bg-gray-100 dark:hover:bg-zinc-700 py-2">
          EDIT
        </button>
        <p class="text-black/20">|</p>
        <button
          @click="removeBank(bank.account_id)"
          class="font-medium text-violet-500 flex-1 hover:bg-gray-100 dark:hover:bg-zinc-700 py-2">
          REMOVE
        </button>
      </div>

      <div v-if="_$p.data.curr.data.mode=='picker'"
        class="border-t border-black/20 mt-2"></div>

    </Tag>
  </div>
</template>

<script lang="ts" setup>
import type { _$p_TYP, _p_TYP } from '../../../shared/types/index.ts'
import { useBank } from '../composables/useBank.ts'
import { createTemplate } from "bind-str"

const { bankAccounts, removeBank } = useBank()

const {_p, __p:_$p} = defineProps<{
  _p:_p_TYP,
  __p:_$p_TYP,
}>()

_$p.data.curr.data.mode = _$p.data.curr.data.mode || "normal"
const Tag = _$p.data.curr.data.mode == 'picker' ? "label" : "div"

const editBank = (bank:any) => {
  try {
    const _t = createTemplate(_$p.data.curr.data.event[`onClickEdit`])
    const _u = _t({ id: bank.account_id })
    location.href = `${_u}`
  } catch (err) {
    console.log(`editBank err:${err}`)
  }
}

const _pick = (bank:any) => {
  _p.f.call("msg", {
    type:"pick",
    _$p,
    _p,
    custom:{
      bank: JSON.parse(JSON.stringify(bank))
    }
  })
}
</script>
