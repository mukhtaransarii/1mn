<template>
  <div class="max-w-2xl mx-auto dark:bg-zinc-900">
    <div v-if="showForm">
      <BankForm v-bind="{_p:_p,__p:_$p}" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { _p_TYP, _$p_TYP } from "../shared/types"
import BankForm from './src/components/BankForm.vue'
import { useBank } from './src/composables/useBank.ts'
import { createTemplate } from 'bind-str'

const {_p,_$p} = defineProps<{ _p:_p_TYP, _$p:_$p_TYP }>()
const { selectedBank, showForm, formMode, form, viewBank } = useBank()
const { id } = Object.fromEntries(new URLSearchParams(location.search || ``))

const addBank = () => {
  selectedBank.value = null
  Object.keys(form).forEach(k => form[k] = '')
  formMode.value = 'create'
  showForm.value = true
}

const editBank = async (id: string) => {
  const bank = await viewBank(id)
  if (!bank) throw new Error("no bank found")

  selectedBank.value = bank
  Object.assign(form, bank)

  formMode.value = 'update'
  showForm.value = true   // ✅ REQUIRED
}


(async()=>{
  try {
    id ? await editBank(id) : addBank()
  } catch (err) {
    try {
      const _t = createTemplate(_$p.data.curr.data.event[`onNotFound`])
      location.href = _t({})
    } catch(e){}
  }
})()
</script>
