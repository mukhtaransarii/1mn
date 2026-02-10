<template>
  <div class="p-4 shadow-md">
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base/7 font-semibold text-gray-900">Bank Account</h2>
        <p class="text-sm/6 text-gray-600">This bank account will be used for payments.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

          <!-- Holder Name -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm/6 font-medium text-gray-900">Full name</label>
            <div class="mt-2">
              <input
                v-model="form.holder_name"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter Holder Name"
              />
            </div>
          </div>

          <!-- IFSC -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm/6 font-medium text-gray-900">IFSC</label>
            <div class="mt-2">
              <input
                v-model="form.ifsc_code"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter IFSC Code"
              />
            </div>
          </div>

          <!-- Account Number -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm/6 font-medium text-gray-900">Account Number</label>
            <div class="mt-2">
              <input
                v-model="form.account_number"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter Account Number"
              />
            </div>
          </div>

          <!-- UPI -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm/6 font-medium text-gray-900">UPI</label>
            <div class="mt-2">
              <input
                v-model="form.upi_id"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter UPI ID"
              />
            </div>
          </div>

          <!-- Country -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm/6 font-medium text-gray-900">Country</label>
            <div class="mt-2">
              <input
                v-model="form.country"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter Country"
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex justify-end gap-x-6">
      <button @click="cancel"
        class="rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white">
        Cancel
      </button>

      <button @click="submit"
        class="capitalize rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white">
        {{ formMode + ' Bank' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBank } from '../composables/useBank.ts'
import { createTemplate } from 'bind-str'
import type { _$p_TYP, _p_TYP } from '../../../shared/types/index.ts'

const {_p, __p:_$p} = defineProps<{ _p:_p_TYP, __p:_$p_TYP }>()

const { createBank, updateBank, form, formMode, showForm, selectedBank } = useBank()

const submit = async () => {
  if (formMode.value === 'create') await createBank(_$p)
  if (formMode.value === 'update') await updateBank(_$p, selectedBank.value?.account_id)
}

const cancel = () => {
  selectedBank.value = null
  showForm.value = false
  Object.keys(form).forEach(k => form[k] = '')

  try {
    const _t = createTemplate(_$p.data.curr.data.event[`onCancel`])
    location.href = _t({})
  } catch (err) {
    console.log(`bank, err:${err}`)
  }
}
</script>
