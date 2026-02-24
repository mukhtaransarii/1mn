import { ref, computed, watch } from "vue"
import type { _$p_TYP } from "../../../shared/types"

//set..
const _$p = ref<_$p_TYP>();

export const useVar = (/*_v?:{
  _$p:_$p_TYP
}*/) => {
  //const _$p = _v?._$p;
  return { _$p }
} 