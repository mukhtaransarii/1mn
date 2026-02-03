<template>
  <div class="grid grid-cols-[220px_1fr_320px] h-screen">
    <LeftPanel :_p="_p" :__p="_$p" />
    <Canvas :_p="_p" :__p="_$p" />
    <ConfigPanel :_p="_p" :__p="_$p" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import type { _p_TYP, _$p_TYP } from "../shared/types";
import LeftPanel from "./src/component/LeftPanel.vue";
import Canvas from "./src/component/Canvas.vue";
import ConfigPanel from "./src/component/ConfigPanel.vue";
import { useUIManager } from "./src/composables/useUIManager";

const { listUI } = useUIManager();

onMounted(async () => await listUI());

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

(async () => {
    //==test==//  [START]
    /* await _p.f.wait_until(() => window.location !== null, 50); */

    //1
    _p.my[`emitter`] = _p.f.new_emitter();
    _p.my[`emitter`].on("msg", async (_$:any) => {
        console.log(`_p.my.emitter.on`, _$);
    });
    await _p.my[`emitter`].emit("msg", {
        type: `on:change`,
        _p: _p,
        _$p: _$p,
    });

    
    //2
    /*_p.f.listen("msg", async (_$) => {
        console.log(`_p.f.listen`, _$);
    });
    setTimeout(async () => {
        await _p.f.call("msg", {
            type: `on:change`,
            _p: _p,
            _$p: _$p,
        });
    }, 500);*/

    //==test==//  [END]
})();

</script>
