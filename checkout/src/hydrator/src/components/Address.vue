<template>
    <div class="w-full bg-white">  
      <div v-if="_html" v-html="_html">
      </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from 'vue'
    import type { _p_TYP, _$p_TYP } from "../../../shared/types";
    import { ce_renderer, ce_hydrator, ce_listen, ce_call } from "content-engine-lib";
    

    const {_ins,_p,_$p} = defineProps<{
        _ins:any,
        _p:_p_TYP,
        _$p:_$p_TYP,
    }>();
    


    // pasted from test_0
    const _html : any = ref(null);

    onMounted(() => {
        (async () => {
        //set vars..
        let _css_server = ``;
        let _css_client = ``;
        //set..
        let _editor_html = ``;
        let _editor_css_client = ``;
          let _data = {
            l: [

              _$p.data.curr.data.address_list[`ce_file`]

            ]
        };


        const _cnf = {
        lib:[],
        lazy_lib: {
            "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/renderer.es.js",
            "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/hydrator.es.js",
            "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/editor.es.js"
        }
        };

        //set..
        const _ce_renderer = await ce_renderer(_cnf);
        const _ce_hydrator = await ce_hydrator(_cnf);
        

        // pasted from https://github.com/1mn-io/mn-app/blob/main/modules/table/test/test_1.ts line:[120 - 141]
        (async()=>{
            _p.f.listen("msg", async(_$)=>{
                //ce_call("child:msg" as any, _$);
            });
            ce_listen("msg", async(_$:any)=>{ //msg
                console.log(`[ce_listen]`,_$);
                //_p.f.call("child:msg" as any, _$);
                //update..
                _ins.var.payload.address = _$.custom[`address`];
                _ins.var.btn.disable = false;

            });
            
        })();

        


        // pasted from test_0 _run fun()
        const _run = async () => {
            //set..
            //if (import.meta.client) { // import.meta.server |  import.meta.client  //NOTE: For real world where, we need SSR in action we use "import.meta.server". 
            const _ce_renderer_rsp =  await _ce_renderer.set({
            data:_data
            });
            //console.log(_ce_renderer_rsp.r);

            //set..
            _html.value = _ce_renderer_rsp.r || "";
            _css_server = _ce_renderer_rsp.style;


            const mS = document.createElement('style');
            document.head.appendChild(mS);
            mS.innerHTML = _css_server;


            //}
            //if (import.meta.client) {
            setTimeout(async() => {
            const _ce_hydrator_rsp =  await _ce_hydrator.set({
            data:_data
            });

            //set..
            console.log(_ce_hydrator_rsp);

            //}  
            }, 200);
        }

        await _run();
        })();
    })

</script>
