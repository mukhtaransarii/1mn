<template>
  <div
    class="ce-wrapper"
    :data-uid="module.uid"
  >
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading {{ module.type }}...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>Error loading component</p>
      <small>{{ error }}</small>
    </div>
    <div v-else-if="_html" v-html="_html"></div>
  </div>
</template>

<style scoped>
.ce-wrapper {
  position: relative;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  /* visual */
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  /*padding: 12px;*/
  min-height: 80px;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
}

.error-state {
  color: #dc2626;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* HARD constraints for CE-rendered content */
.ce-wrapper :deep(img),
.ce-wrapper :deep(video),
.ce-wrapper :deep(canvas),
.ce-wrapper :deep(svg) {
  max-width: 100% !important;
  height: auto !important;
  display: block;
}

/* Prevent absolute-position escape */
.ce-wrapper :deep(*) {
  max-width: 100%;
  box-sizing: border-box;
}
</style>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { _p_TYP, _$p_TYP } from "../../../shared/types";
import { ce_renderer, ce_hydrator } from "content-engine-lib";

const { _p, __p: _$p, module } = defineProps<{
  _p: _p_TYP,
  __p: _$p_TYP,
  module: any
}>();

const _html = ref<string>("");
const isLoading = ref(true);
const error = ref<string | null>(null);
let styleElement: HTMLStyleElement | null = null;

// Create a unique instance ID for this component
const instanceId = `ce-${module.uid}`;

const initializeComponent = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Use the ce_data from the module instance (already a fresh copy)
    const _data: any = {
      l: [...module.ce_data] // Additional safety: spread the array
    };

    console.log(`[${instanceId}] Initializing with data:`, {
      uid: module.uid,
      type: module.type,
      dataItems: _data.l.length
    });

    if (_data.l.length === 0) {
      throw new Error("No data available for this component");
    }

    const _cnf = {
      lib: [],
      lazy_lib: {
        "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/renderer.es.js",
        "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/hydrator.es.js",
        "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/editor.es.js"
      }
    };

    // Initialize renderers
    const _ce_renderer = await ce_renderer(_cnf);
    const _ce_hydrator = await ce_hydrator(_cnf);

    // Render
    const _ce_renderer_rsp = await _ce_renderer.set({
      data: _data,
      return: {
        r: "chunk"
      }
    });

    console.log(`[${instanceId}] Renderer response:`, {
      chunks: _ce_renderer_rsp.r?.length,
      hasStyle: !!_ce_renderer_rsp.style
    });

    // Build HTML from chunks
    let htmlContent = "";
    for (const element of _ce_renderer_rsp.r) {
      if (typeof element === "string") {
        htmlContent += `
          <div style="border:1px solid transparent; margin:4px; padding:4px;">
            ${element}
          </div>
        `;
      }
    }

    _html.value = htmlContent;

    // Inject styles with unique scoping
    if (_ce_renderer_rsp.style) {
      styleElement = document.createElement("style");
      styleElement.setAttribute("data-ce-instance", instanceId);
      styleElement.innerHTML = _ce_renderer_rsp.style;
      document.head.appendChild(styleElement);
    }

    // Hydrate after render
    setTimeout(async () => {
      try {
        await _ce_hydrator.set({
          data: _data
        });
        console.log(`[${instanceId}] Hydration complete`);
      } catch (e) {
        console.error(`[${instanceId}] Hydration error:`, e);
      }
    }, 10);

    isLoading.value = false;

  } catch (err) {
    console.error(`[${instanceId}] Initialization error:`, err);
    error.value = err instanceof Error ? err.message : "Unknown error";
    isLoading.value = false;
  }
};

// Initialize on mount
onMounted(() => {
  initializeComponent();
});

// Clean up styles on unmount
onUnmounted(() => {
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
  }
});

// Watch for module data changes (if config panel updates it)
watch(() => module.ce_data, () => {
  console.log(`[${instanceId}] Data changed, reinitializing...`);
  initializeComponent();
}, { deep: true });
</script>