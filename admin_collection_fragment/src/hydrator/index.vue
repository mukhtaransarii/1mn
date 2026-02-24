<template>
    <div  v-if="_var.html.table">
        <div v-html="_var.html.table"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { _p_TYP, _$p_TYP } from "../shared/types";
import { ce_renderer, ce_hydrator, ce_listen, ce_call } from "content-engine-lib";

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

const _html : any = ref(null);

//set..
const _var = ref({
    html:{
        table:null,
    }
});

// API Configuration
const API_CONFIG = {
    url: 'https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=list_collection',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
};

// Function to fetch list
async function fetchList() {
  try {
    const res = await fetch(API_CONFIG.url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_CONFIG.token}`,
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Convert API response to table rows
function convertApiDataToRows(api: any) {
  if (!api?.success) return [];

  return api.collections.map((c: any, index: number) => ({
    id: c.name,
    sno: index + 1,
    name: c.name,
    num_documents: c.num_documents,
    status:
      c.num_documents > 0
        ? '<button class="px-2 py-1 rounded bg-emerald-100 text-emerald-700">Active</button>'
        : '<button class="px-2 py-1 rounded bg-red-100 text-red-700">Empty</button>',
  }));
}



// Update table with new data
async function updateTableData(_$: any) {
  const api = await fetchList();
  if (!api?.success) return;

  const rows = convertApiDataToRows(api);

  _$._$p.data.curr.data.table.rows = rows;

  ce_call('msg', {
    type: 'load_more',
    _p: _$._p,
    _$p: _$._$p,
    where: {
      key: 'id',
      value: '3e1bc78c-104f-4f6f-aa87-75',
    },
  });
}


onMounted(() => {
    (async () => {
        let _css_server = ``;
        let _css_client = ``;
        let _editor_html = ``;
        let _editor_css_client = ``;
        
        // Fetch initial data from API
        //const apiResponse = await fetchList(searchText.value, currentPage.value, perPage.value);
        //const apiRows = convertApiDataToRows(apiResponse);

        let _data = {
            l: [
                {
                    "id": "3e1bc78c-104f-4f6f-aa87-75",
                    "type": "table",
                    "slug": "table",
                    "data": {
                        "theme": _$p.data.curr.data.theme,//"light",
                        "foo": {},
                        "config": {},
                        "table": {
                            "columns": [
                              { title: "#", field: "sno", hozAlign: "center", width: 60 },
                              { title: "Collection Name", field: "name", minWidth: 250 },
                              { title: "Total Documents", field: "num_documents", hozAlign: "center", width: 180 },
                              { title: "Status", field: "status", formatter: "html", hozAlign: "center", width: 120 }
                            ],
                            "rows": []
                        }
                    }
                },     
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

        const _ce_renderer = await ce_renderer(_cnf);
        const _ce_hydrator = await ce_hydrator(_cnf);

        (async()=>{
            ce_listen('msg', async (_$) => {
              // endless scroll
              if (_$.type === 'load_more' && _$._$p.data.curr.id === '3e1bc78c-104f-4f6f-aa87-75') {
                  updateTableData(_$);
              }
            });
        })();

        const _run = async () => {
            const _ce_renderer_rsp = await _ce_renderer.set({
                data:_data,
                return:{
                    r:"chunk",//full, chunk
                }
            });
            //console.log(_html.value);

            //_html.value = _ce_renderer_rsp.r || "";
            _css_server = _ce_renderer_rsp.style;
            //set..
            _var.value.html.table = _ce_renderer_rsp.r[0] || "";

            //log..
            //console.log(_var.value.html.table);
            //console.log(_var.value.html.search_panel);
            


        
            //set..
            const mS = document.createElement('style');
            document.head.appendChild(mS);
            mS.innerHTML = _css_server;

            setTimeout(async() => {
                const _ce_hydrator_rsp = await _ce_hydrator.set({
                    data:_data
                });
                console.log(_ce_hydrator_rsp);
            }, 20);
        }

        await _run();
    })();
});

</script>