// src/composable/useOrder.ts
import { ref, watch } from "vue"

const storedOrder = null;//localStorage.getItem("currentOrder")
const currentOrder = ref(storedOrder ? JSON.parse(storedOrder) : null)

export const useOrder = () => {
  // Set order and persist in localStorage
  const setOrder = (order: any) => {
    currentOrder.value = order;
    //localStorage.setItem("currentOrder", JSON.stringify(order));
  }

  // Clear order if needed
  const clearOrder = () => {
    currentOrder.value = null;
    //localStorage.removeItem("currentOrder");
  }

  return { currentOrder, setOrder, clearOrder }
}
