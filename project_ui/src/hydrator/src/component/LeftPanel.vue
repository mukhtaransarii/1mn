<template>
  <aside 
  class-old="w-full h-full border-r bg-gray-50 p-4 flex flex-col"
  class="w-full h-full border-r border-r-gray-300  bg-gray-50 p-4 flex flex-col"
  >
    <div class="mb-6">
      <h2 class="text-sm font-semibold text-gray-700 mb-1 tracking-wide">
        COMPONENTS
      </h2>
      <p class="text-xs text-gray-500">
        Drag to canvas. Add multiple instances of any component.
      </p>
    </div>

    <div class="space-y-2 flex-1 overflow-auto">
      <div
        v-for="mod in engine.availableModules"
        :key="mod.id"
        draggable="true"
        @dragstart="startDrag(mod, $event)"
        @dragend="onDragEnd"
        class="
          group
          px-3 py-3
          flex items-center gap-2
          bg-white
          border-2 border-gray-200
          rounded-lg
          cursor-grab
          transition-all
          hover:bg-indigo-50
          hover:border-indigo-300
          hover:shadow-md
          active:cursor-grabbing
          active:scale-95
        "
      >
        <!-- Icon based on type -->
        <div class="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center">
          <svg
            v-if="mod.type === 'carousel'"
            class="w-5 h-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <svg
            v-else-if="mod.type === 'cart_popup'"
            class="w-5 h-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div>
            <p class="text-sm font-medium capitalize">{{ mod.label }}</p>
            <p class="text-xs text-gray-500">{{ getUsageCount(mod.type) }} in use</p>
          </div>

          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-400 group-hover:text-indigo-600 transition font-medium">DRAG</p>
            <svg
              class="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>


    <!-- Stats footer -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="text-xs text-gray-500 space-y-1">
        <div class="flex justify-between">
          <span>Total components:</span>
          <span class="font-semibold text-gray-700">{{ engine.canvasModules.length }}</span>
        </div>
        <div class="flex justify-between">
          <span>Available types:</span>
          <span class="font-semibold text-gray-700">{{ engine.availableModules.length }}</span>
        </div>
      </div>
      
      <!-- Debug: Show instances -->
      <details class="mt-3 text-xs">
        <summary class="cursor-pointer text-indigo-600 hover:text-indigo-800">
          Debug: View all instances
        </summary>
        <div class="mt-2 space-y-1 max-h-32 overflow-auto bg-gray-50 p-2 rounded">
          <div v-for="mod in engine.canvasModules" :key="mod.uid" class="text-xs">
            <strong>{{ mod.type }}</strong>: {{ mod.uid.slice(0, 8) }}...
          </div>
        </div>
      </details>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { engine } from "../engine/connectEngine";

function startDrag(mod, e) {
  e.dataTransfer.setData("module", JSON.stringify(mod));
  e.dataTransfer.effectAllowed = "copy";
  
  // Visual feedback
  e.target.style.opacity = "0.5";
}

function onDragEnd(e) {
  e.target.style.opacity = "1";
}

function getUsageCount(type) {
  return engine.canvasModules.filter(m => m.type === type).length;
}
</script>