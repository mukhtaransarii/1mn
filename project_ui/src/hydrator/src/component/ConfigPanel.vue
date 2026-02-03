<template>
  <aside class="flex flex-col">

    <div class="px-4 py-4 bg-gray-50 flex flex-col gap-4" >
      <!-- Icon -->
       <div class="flex justify-between items-center">
         <div>
           <p class="capitalize leading-none text-sm">{{ mode }}</p>
           <p v-if="mode === 'create'" class="text-xs text-gray-500">create new module</p>
           <p v-else class="text-xs text-gray-500">id: {{ editingId }}</p>
         </div>

         <svg @click="formToggle = !formToggle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 cursor-pointer">
           <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>

          <svg @click="deleteUI(editingId)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>

       </div>

      <!-- Inputs -->
      <div v-show="formToggle" class="flex flex-col gap-4">
        <div class="flex flex-col text-sm">
          <label class="text-gray-600">Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="Enter name"
            class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div class="flex flex-col text-sm">
          <label class="text-gray-600">Type</label>
          <input
            v-model="type"
            type="text"
            placeholder="Enter type"
            class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div class="flex flex-col text-sm">
          <label class="text-gray-600">Dta</label>
          <input
            v-model="dta"
            type="text"
            placeholder="Enter dta"
            class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div class="flex items-center gap-4">
          <!-- <div @click="deleteUI(editingId)" class="bg-gray-100 rounded-xl p-2 hover:bg-gray-200 cursor-pointer" v-if="mode === 'edit'">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div> -->

          <button @click="submit" :disabled="!name || !type" class="flex-1 p-2 bg-blue-500 text-white rounded capitalize disabled:opacity-50">{{ mode }} UI</button>
        </div>
      </div>

    </div>


    <div
      v-if="selected"
      class-old="w-80 h-full border-l bg-white flex flex-col"
      class="w-80 h-full border border-gray-300 bg-white flex flex-col"
    > 
    
      <!-- Header -->
      <div 
      class-old="px-4 py-3 border-b bg-gray-50"
      class="px-4 py-3 border-b border-b-gray-300 bg-gray-50"
      >
        <h3 class="text-sm font-semibold text-gray-800">
          CONFIGURATION
        </h3>
        <p class="text-xs text-gray-500 mt-1">
          {{ selected.type }} component
        </p>
      </div>

      <!-- Body -->
      <!-- <div class="flex-1 overflow-auto p-4 space-y-4">
        <div
          v-for="(value, key) in selected.config"
          :key="key"
          class="space-y-1"
        >
          <label class="text-xs font-medium text-gray-600 uppercase">
            {{ key }}
          </label>

          <input
            class="w-full rounded-md border px-3 py-2 text-sm
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            :value="value"
            @input="update(key, $event.target.value)"
          />
        </div>
      </div> -->

      <div
          v-for="(value, key) in selected.ce_config"
          :key="key"
          class="flex-1 overflow-auto p-4 space-y-1"
        >
          <label class="text-xs font-medium text-gray-600 uppercase">{{ key }}</label>

          <!-- STRING / NUMBER -->
          <input
            v-if="typeof value !== 'object'"
            class="w-full rounded-md border px-3 py-2 text-sm
                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            :value="value"
            @input="update(key, $event.target.value)"
          />

          <!-- OBJECT -->
          <textarea
            v-else
            class="w-full rounded-md border px-3 py-2 text-sm font-mono whitespace-pre overflow-x-auto"
            :value="JSON.stringify(value, null, 2)"
            rows="5"
            disabled
          ></textarea>
      </div>


      <!-- Footer -->
      <div 
      class-old="border-t p-4 bg-gray-50 space-y-2"
      class="border-t border-t-gray-300 p-4 bg-gray-50 space-y-2"
      >
        <button
          @click="remove"
          class="
            w-full
            text-sm
            font-medium
            text-red-600
            border border-red-200
            rounded-md
            py-2
            hover:bg-red-50
          "
        >
          Remove Component
        </button>

        <p class="text-xs text-gray-400 text-center">
          ID: {{ selected.slug }}
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup>
  import { computed, watch, ref } from "vue";
  import { engine } from "../engine/connectEngine";
  import { useUIManager } from "../composables/useUIManager";
  const { createUI, getUI, updateUI, deleteUI } = useUIManager();

  const selected = computed(() =>
    engine.canvasModules.find(m => m.uid === engine.selectedId)
  );

  function update(key, value) {
    engine.update(selected.value.uid, { [key]: value });
  }

  function remove() {
    engine.remove(selected.value.uid);
  }
  


  // -------------- FORM API LOGIC --------------
  const formToggle = ref(false);
  const name = ref("");
  const type = ref("");
  const dta = ref("");

  const mode = ref("create");
  const editingId = ref(null);
  
  const resetForm = () => {
    mode.value = "create";
    editingId.value = null;
    name.value = "";
    type.value = "";
  };



  const modulesPrint = async () => {
    let _ce_file = {
        "config": {
            "lazy_lib": {
                "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/renderer.es.js",
                "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/hydrator.es.js",
                "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/editor.es.js"
            }
        },
        "data": {
            "l": [
                // {
                //     "id": "3e1bc78c-checkout",
                //     "type": "checkout",
                //     "slug": "checkout",
                //     "data": {
                //         "data": "Hello world! ",
                //         "theme": "light"
                //     }
                // }
            ]
      }
    };

    for (const element of engine.canvasModules) {
      _ce_file.data.l.push(
        ...element.ce_data
      );
    }

    console.log('saved _ce_file:', _ce_file);
    console.log('saved engine.canvasModules:', engine.canvasModules);


    if (mode.value === "create") { 
      await createUI({
      typ: type.value,
      name: name.value,
      dta: { ce_file: _ce_file }
    });
    } else {
      await updateUI({
        id: editingId.value,
        typ: type.value,
        name: name.value,
        dta: { ce_file: _ce_file } // dta.value
      });
    }
    
  };
  
  const submit = async () => {
      modulesPrint();
  };

  
  // // get id from query param.
  watch(selected, async () => {
    const id = new URLSearchParams(location.search).get("id");
    if (!id) return resetForm();

    mode.value = "edit";
    editingId.value = id;

    const data = await getUI(id);
    if (!data) return;

    
    name.value = data.name;
    type.value = data.typ;
    dta.value = data.dta ?? "";


    // set 
    
    for (const element of data.dta.ce_file.data.l) {
      engine.canvasModules.push(engine.formatBlock({ ce_file: data.dta.ce_file, curr: element }));
    }
   },
   { immediate: true }
  );
</script>
