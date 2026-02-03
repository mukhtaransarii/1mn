<template>
  <div class="flex flex-col h-full w-full bg-gray-200 overflow-hidden">
    
    <div class="h-12 bg-white border-b border-gray-300 flex items-center justify-center gap-4 px-4 shadow-sm z-20 flex-shrink-0">
      <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Screen Size</span>
      
      <button @click="setWidth(375)" class="device-btn" :class="{ active: currentWidth === 375 }" title="Mobile">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>
      </button>

      <button @click="setWidth(768)" class="device-btn" :class="{ active: currentWidth === 768 }" title="Tablet">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>
      </button>

      <button @click="setWidth(1280)" class="device-btn" :class="{ active: currentWidth === 1280 }" title="Desktop">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
      </button>
      
      <button @click="setFullWidth" class="device-btn" :class="{ active: isFullWidth }" title="Full Width">
        <span class="text-xs font-bold">100%</span>
      </button>

      <div class="ml-4 px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">
        {{ Math.round(currentWidth) }}px
      </div>
    </div>

    <div 
      class="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col items-center py-8 pb-32"
      ref="scrollContainer"
      @click="engine.select(null)" 
    >
      <main
        ref="canvasRef"
        class="device-frame transition-all duration-200 ease-out h-auto min-h-[80vh]"
        :class="{ 'is-resizing': isResizing }"
        :style="{ width: isFullWidth ? '100%' : currentWidth + 'px' }"
        @dragover.prevent="onDragOver"
        @drop="onDrop"
        @dragleave="onDragLeave"
      >
        <div
          v-if="engine.canvasModules.length === 0"
          class="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl m-4"
        >
          <svg class="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <p class="text-sm text-gray-500">Drag components here</p>
        </div>

        <TransitionGroup name="canvas" tag="div" class="space-y-1 min-h-[100px] h-auto w-full">
          <template v-for="(mod, index) in engine.canvasModules as any[]" :key="mod.uid">
            
            <div v-if="engine.dragOverIndex === index" class="drop-indicator">
              <div class="line"></div>
            </div>

            <div
              class="ce-parent draggable relative group flex-shrink-0"
              :class="{ selected: engine.selectedId === mod.uid }"
              :data-uid="mod.uid"
              draggable="true"
              @dragstart="onDragStart(mod.uid, $event)"
              @dragend="onDragEnd"
              @click.stop="engine.select(mod.uid)"
            >
              <div class="ce-actions">
                <button @click.stop="minMax(mod)" title="Minimize / Maximize">
                  <svg v-if="!mod.minimized" width="12" height="12" viewBox="0 0 12 12">
                    <!-- Maximize -->
                    <rect x="2" y="2" width="8" height="8" stroke="currentColor" stroke-width="1.5" fill="none" />
                  </svg>

                  <svg v-else width="12" height="12" viewBox="0 0 12 12">
                    <!-- Minimize -->
                    <rect x="2" y="6" width="8" height="1.5" fill="currentColor" />
                  </svg>
                </button>
                
                <button @click.stop="engine.moveUp(mod.uid)" :disabled="index === 0" title="Move Up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                </button>
                <button @click.stop="engine.moveDown(mod.uid)" :disabled="index === engine.canvasModules.length - 1" title="Move Down">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <button class="delete" @click.stop="engine.remove(mod.uid)" title="Delete">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>



              <div :class="`p-1 ${mod.minimized ? `` : `h-50 overflow-clip`}`" >
                <ContentEngine :module="mod" :_p="_p" :__p="_$p" />
              </div>


            </div>

             <div v-if="index === engine.canvasModules.length - 1 && engine.dragOverIndex === engine.canvasModules.length" class="drop-indicator">
              <div class="line"></div>
            </div>

          </template>
        </TransitionGroup>

        <div 
          v-if="!isFullWidth"
          class="resize-handle"
          @mousedown.prevent="startResize"
        >
          <div class="resize-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, computed } from "vue";
  import { engine } from "../engine/connectEngine";
  import ContentEngine from "./ContentEngine.vue";
  import type { _p_TYP, _$p_TYP } from "../../../shared/types";

  const { _p, __p: _$p } = defineProps<{ _p: _p_TYP; __p: _$p_TYP }>();

  /* ───────────────── Resizing Logic ───────────────── */
  const currentWidth = ref(600); 
  const isFullWidth = ref(false);
  const isResizing = ref(false);
  let startX = 0;
  let startWidth = 0;


  function minMax(_v:any) {
    // console.log(_v);
    if (_v.minimized) {
    _v.minimized = false;
    }else{
    _v.minimized = true;
    }
    
  }

  function setWidth(w: number) {
    currentWidth.value = w;
    isFullWidth.value = false;
  }

  function setFullWidth() {
    isFullWidth.value = true;
  }

  function startResize(e: MouseEvent) {
    isResizing.value = true;
    startX = e.clientX;
    startWidth = currentWidth.value;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isResizing.value) return;
    const dx = e.clientX - startX;
    const newWidth = startWidth + (dx * 2);
    if (newWidth >= 320 && newWidth <= 2500) {
      currentWidth.value = newWidth;
    }
  }

  function stopResize() {
    isResizing.value = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  /* ───────────────── Drag & Drop Logic ───────────────── */
  const canvasRef = ref<HTMLElement | null>(null);
  let draggingUid: string | null = null;

  function onDragOver(e: DragEvent) {
    if (!canvasRef.value) return;
    const dropIndex = engine.getDropIndex(e.clientY, canvasRef.value);
    engine.setDragOverIndex(dropIndex);
  }

  function onDragLeave(e: DragEvent) {
    if (e.target === canvasRef.value) engine.clearDragOverIndex();
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault();
    const moduleData = e.dataTransfer?.getData("module");
    
    if (moduleData) {
      const mod = JSON.parse(moduleData);
      await engine.addToCanvas(mod, engine.dragOverIndex);
    } else if (draggingUid) {
      engine.moveModule(draggingUid, engine.dragOverIndex ?? engine.canvasModules.length);
    }
    engine.clearDragOverIndex();
    draggingUid = null;
  }

  function onDragStart(uid: string, e: DragEvent) {
    draggingUid = uid;
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("text/plain", uid);
  }

  function onDragEnd() { draggingUid = null; engine.clearDragOverIndex(); }


  /* ───────────────── queary param id Logic , MUKHTAR ───────────────── */
  // onMounted(() => {
  //   const id = new URLSearchParams(location.search).get("id");
  //   const mod : any = engine.canvasModules.find((m:any) => m.slug === id);
  //   if (mod) engine.select(mod.uid);
  // });

  // watch(() => engine.selectedId, (uid) => {
  //   const url = new URL(location.href);
  //   const mod : any = engine.canvasModules.find((m:any) => m.uid === uid);
  //   mod ? url.searchParams.set("id", mod.slug) : url.searchParams.delete("id");
  //   history.replaceState({}, "", url);
  // });

  console.log('engine.available:', engine.canvasModules);
</script>

<style scoped>
/* ───────────────── Device Frame ───────────────── */
.device-frame {
  position: relative;
  background: white;
  /* Removed h-full here, using min-height instead */
  box-shadow: 
    0 0 0 1px rgba(0,0,0,0.05),
    0 20px 50px -10px rgba(0,0,0,0.15);
  border-radius: 4px;
  padding: 1px;
}

.device-frame.is-resizing {
  transition: none !important;
  pointer-events: none;
}
.device-frame.is-resizing .resize-handle {
  pointer-events: auto;
}

/* ───────────────── Resize Handle ───────────────── */
.resize-handle {
  position: absolute;
  top: 50%;
  right: -24px;
  transform: translateY(-50%);
  width: 24px;
  height: 60px;
  background: #374151;
  color: white;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ew-resize;
  z-index: 50;
  box-shadow: 4px 0 10px rgba(0,0,0,0.1);
  transition: background 0.2s;
}

.resize-handle:hover {
  background: #111827;
  width: 28px;
}

/* ───────────────── Toolbar Buttons ───────────────── */
.device-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;
}

.device-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.device-btn.active {
  background: #e0e7ff;
  color: #4f46e5;
}

/* ───────────────── Component Styles ───────────────── */
.ce-parent {
  position: relative;
  background: white;
  border: 2px solid transparent;
  /* Ensure components don't shrink */
  flex-shrink: 0; 
}
.ce-parent:hover {
  box-shadow: inset 0 0 0 2px #3b82f6;
  z-index: 10;
}
.ce-parent.selected {
  box-shadow: inset 0 0 0 2px #2563eb;
  z-index: 10;
}

.ce-actions {
  position: absolute;
  top: 4px; 
  right: 4px;
  background: #2563eb;
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 50;
  border-radius: 4px;
  padding: 2px;
  pointer-events: none; /* Pass through clicks when invisible */
}

/* Fix: Allow pointer events when visible */
.ce-parent:hover .ce-actions, 
.ce-parent.selected .ce-actions { 
  opacity: 1; 
  pointer-events: auto;
}

.ce-actions button {
  padding: 4px;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ce-actions button:hover { background: rgba(255,255,255,0.2); }
.ce-actions button.delete:hover { background: #ef4444; }

/* Drop Indicator */
.drop-indicator {
  height: 10px;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.drop-indicator .line {
  width: 100%; height: 3px; background: #2563eb; border-radius: 2px;
}

/* Animations */
.canvas-move { transition: transform 0.3s ease; }
.canvas-enter-active, .canvas-leave-active { transition: all 0.2s ease; }
.canvas-enter-from, .canvas-leave-to { opacity: 0; transform: scale(0.95); }
</style>