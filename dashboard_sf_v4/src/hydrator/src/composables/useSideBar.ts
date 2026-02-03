import { ref } from "vue";

const setMenu = ref<any>({ label: 'Home', value: 'Home', type: 'Fragments' });

export function useSideBar() {
  return { setMenu };
}