<template>
    <div v-if="_html" v-html="_html" ></div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { _p_TYP, _$p_TYP } from "../../../shared/types";
import { ce_renderer, ce_hydrator, ce_call } from "content-engine-lib";
//import { useRoute } from 'vue-router';

//set..
const {//_p,__p:_$p,
  ce_file} = defineProps<{
    //_p:_p_TYP,
    //__p:_$p_TYP,
    //set..
    ce_file:any,
}>(); 
//console.log(_$p);
//const route = useRoute();
//console.log(route.meta);

//set..
const _ins = ref<any>({
    ce_file:ce_file,//route?.meta?.ce_file,
});
//console.log(_ins.value.ce_file);

//set..
defineExpose({
  ce_call
});

//set..
const _rsp:any = ref(null);


//set vars..
const _html = ref(null);
let _css_server = ``;
let _css_client = ``;
//set..
let _editor_html = ``;
let _editor_css_client = ``;
//set..
(async() => {
try {
if (typeof _ins.value.ce_file=="string") {
const _api_r = await fetch(_ins.value.ce_file);
const _j = await _api_r.json();
//console.log(_j);
_rsp.value = _j;
}else{
_rsp.value = _ins.value.ce_file;
}
} catch (err) {
    console.log(err);
    return;
}
//all ok..


//set..
let _data = {
  l: [
    {
        "id": "3e1bc78c-104f-4f6f-aa87-ee295db8ad8c",
        "type": "text",
        "data": {
          "data": "Loading..",
        },
    }

  ]
};
let _cnf = {
  lib:[],
  lazy_lib: {
    renderer_src:`https://cdn.jsdelivr.net/gh/coreutility/content-engine@latest/modules/{*}/dist/renderer.es.js`,
    hydrator_src:`https://cdn.jsdelivr.net/gh/coreutility/content-engine@latest/modules/{*}/dist/hydrator.es.js`,
    editor_src:`https://cdn.jsdelivr.net/gh/coreutility/content-engine@latest/modules/{*}/dist/editor.es.js`,
  }
};


//update..
_data = _rsp.value[`data`];
_cnf.lazy_lib = _rsp.value[`config`].lazy_lib;
//all done..


//set..
const _ce_renderer = await ce_renderer(_cnf);
const _ce_hydrator = await ce_hydrator(_cnf);
/*const _ce_editor = await ce_editor(_cnf);*/




//set..
const _run = async () => {

//set..
//if (import.meta.client) { // import.meta.server |  import.meta.client  //NOTE: For real world where, we need SSR in action we use "import.meta.server". 
const _ce_renderer_rsp =  await _ce_renderer.set({
  data:_data
});
//console.log(_ce_renderer_rsp.r);

//set..
_html.value = _ce_renderer_rsp.r;
_css_server = _ce_renderer_rsp.style;

//set..
const mS = document.createElement("style");
document.head.appendChild(mS);
mS.innerHTML = _css_server;

//}
//if (import.meta.client) {
setTimeout(async() => {
const _ce_hydrator_rsp =  await _ce_hydrator.set({
  data:_data
});

//set..
//_css_client = _ce_hydrator_rsp.style;
//}  


}, 10);

 
};
await _run();



 

 


})();


</script>