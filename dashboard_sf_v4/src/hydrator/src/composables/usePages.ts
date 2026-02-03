import { ref, watch } from "vue";

const set_page = ref(localStorage.getItem("page") || "DASHBOARD");
watch(set_page, v => localStorage.setItem("page", v));

export function usePages() {
  return { set_page };
}