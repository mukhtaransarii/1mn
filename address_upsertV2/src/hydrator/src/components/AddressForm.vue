<template>
  <div class="p-4 shadow-md">
    <div class="space-y-12">
      <!-- Shipping Address -->
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base/7 font-semibold text-gray-900">Shipping Address</h2>
        <p class="text-sm/6 text-gray-600">This address will be used for delivery.</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <!-- Name -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm/6 font-medium text-gray-900">Full name</label>
            <div class="mt-2">
              <input
                v-model="form.name"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="John Doe"
              />
            </div>
          </div>

          <!-- Phone -->
          <div class="sm:col-span-3">
            <label for="name" class="block text-sm/6 font-medium text-gray-900">Phone</label>
            <div class="mt-2">
              <input
                v-model="form.phone_number"
                type="tel"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="10"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter Phone Number"
              />
            </div>
          </div>

          <!-- Street -->
          <div class="col-span-full">
            <label for="street" class="block text-sm/6 font-medium text-gray-900">Street address</label>
            <div class="mt-2">
              <input
                v-model="form.street"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="House no, street name"
              />
            </div>
          </div>

          <!-- Landmark -->
          <div class="col-span-full">
            <label for="landmark" class="block text-sm/6 font-medium text-gray-900">Landmark (optional)</label>
            <div class="mt-2">
              <input
                v-model="form.landmark"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Near park, school, etc."
              />
            </div>
          </div>

          <!-- City -->
          <div class="sm:col-span-2 sm:col-start-1">
            <label for="city" class="block text-sm/6 font-medium text-gray-900">City</label>
            <div class="mt-2">
              <input
                v-model="form.city"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter city"
              />
            </div>
          </div>

          <!-- State -->
          <div class="sm:col-span-2">
            <label for="state" class="block text-sm/6 font-medium text-gray-900">State</label>
            <div class="mt-2">
              <input
                v-model="form.state"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter State"
              />
            </div>
          </div>

          <!-- Pincode -->
          <div class="sm:col-span-2">
            <label for="pincode" class="block text-sm/6 font-medium text-gray-900">Pincode</label>
            <div class="mt-2">
              <input
                v-model="form.pincode"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                maxlength="6"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Enter pincode"
              />
            </div>
          </div>

          <!-- Address Type -->
          <div class="sm:col-span-2">
            <label for="address_type" class="block text-sm/6 font-medium text-gray-900">Address Type</label>
            <div class="mt-2">
              <select
                v-model="form.address_type"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="" disabled>Select Address Type</option>
                <option value="home">Home</option>
                <option value="work">Work</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button @click="cancle" class="rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Cancle
      </button>

      <button @click="submit" class="capitalize rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {{ formMode + ' Address' }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { reactive, watch } from 'vue'
  import { useAddress } from '../composables/useAddress.ts'
  
  const { createAddress, updateAddress, form, formMode, showForm, selectedAddress } = useAddress();

  const submit = async () => {
    if(formMode.value === 'create') await createAddress();
    if(formMode.value === 'update') await updateAddress(selectedAddress.value.address_id);
  }

  const cancle = async () => {
    selectedAddress.value = null
    showForm.value = false
    Object.keys(form).forEach(k => form[k] = '')
  }
  
</script>