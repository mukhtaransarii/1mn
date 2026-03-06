<template>
  <!-- <ProductSearch
    :__internal="{
      _p,
      _$p,
      _$cb,
      toggleTheme,
      isDark
    }"
  /> -->

  <ProductSearch
    :_p="_p"
    :_$p="_$p"
    :_$cb="_$cb"
    :toggleTheme="toggleTheme"
    :isDark="isDark"
  />
</template>

<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import type { _p_TYP, _$cb_TYP, _$p_TYP } from "../shared/types";
  import ProductSearch from "./src/components/productsearch.vue"; 

  const { _p, _$p, _$cb } = defineProps<{
      _p: _p_TYP,
      _$p: _$p_TYP,
      _$cb: _$cb_TYP,
  }>();
  _$p.data.curr.data.mode = _$p.data.curr.data.mode || "normal";


  const isDark = ref(true);

  const applyTheme = (dark: any) => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    isDark.value = dark;
  };

  const toggleTheme = () => {
    applyTheme(!isDark.value);
  };

  onMounted(() => {
    const saved = localStorage.getItem("theme");
    const dark =
      saved === "dark" ||
      (!saved &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    applyTheme(dark);
  });
</script>