<template>

    <div class="pb-3 pt-3 pl-3 pr-3 sticky top-0 bg-white z-10" v-if="_var.html.search_panel">
        <div >
        <div v-html="_var.html.search_panel"></div>
        </div>
    </div>
    <div  v-if="_var.html.table">
        <div v-html="_var.html.table"></div>
    </div>
    <div v-if="_var.html.dialog">
        <div v-html="_var.html.dialog"></div>
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
const searchText = ref('');
const nextCursor = ref<string | null>(null);
const isEnd = ref(false);
let deleteRow: { public_id: string; url: string, resource_type: string } | null = null;

//set..
const _var = ref({
    html:{
        table:null,
        search_panel:null,
        dialog:null
    }
});

// API Configuration
const API_CONFIG = {
    url: 'https://fastapi.dryutil.1mn.io/client/api/i/ona/file_storage?typ=cloudinary&opr=search',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
};

// Function to fetch list
async function fetchList(expression = '', cursor: string | null = null) {
  try {
    const body: any = {
      expression,
      max_results: 20,
    };

    if (cursor) body.next_cursor = cursor;

    const res = await fetch(API_CONFIG.url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_CONFIG.token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(res.statusText);

    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function deleteFile(public_id: string, resource_type: string) {
  try {
    const formData = new FormData();
    formData.append("public_id", public_id);
    formData.append("invalidate", "true");

    const url = `https://fastapi.dryutil.1mn.io/client/api/i/ona/file_storage?typ=cloudinary&opr=delete_file&resource_type=${resource_type}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_CONFIG.token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error(res.statusText);

    return await res.json();
  } catch (err) {
    console.error("Delete error:", err);
    return null;
  }
}




// Convert API response to table rows
function convertApiDataToRows(api: any, _$: any) {
  if (!api?.success) return [];

  const offset = _$._$p.data.curr.data.table.rows.length || 0;

  return api.data.resources.map((r: any, index: number) => ({
    id: r.asset_id,
    sno: offset + index + 1,
    asset_id: r.asset_id,
    public_id: r.public_id,
    resource_type: r.resource_type,
    url: `<a href="${r.secure_url || r.url}" target="_blank" class="text-blue-600 hover:underline">${r.secure_url || r.url}</a>`,
    //status: r.status
    status:
    r.status === 'active'
    ? '<button class="px-2 py-1 rounded bg-emerald-100 text-emerald-700">Active</button>'
    : '<button class="px-2 py-1 rounded bg-red-100 text-red-700">Active</button>'
    ,
    action: `<button class="delete-btn px-2 py-1 rounded bg-red-100 text-red-700 " data-public_id="${r.public_id}" data-url="${r.secure_url || r.url}" data-resource_type="${r.resource_type}">Delete</button>`
  }));
}



// Update table with new data
async function updateTableData(_$: any, expression: string, reset = false) {
  if (isEnd.value && !reset) return;

  if (reset) {
    nextCursor.value = null;
    isEnd.value = false;
  }

  const api = await fetchList(expression, nextCursor.value);

  if (!api?.success) return;

  const rows = convertApiDataToRows(api, _$);
  if (!rows.length) {
    isEnd.value = true;
    return;
  }

  // append rows
  _$._$p.data.curr.data.table.rows.push(...rows);

  // update cursor
  nextCursor.value = api.data.next_cursor || null;
  if (!nextCursor.value) isEnd.value = true;

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

/*// Watch for search text changes with debounce
let debounceTimer: any = null;
watch(searchText, (newValue) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        currentPage.value = 1; // Reset to page 1 on new search
        updateTableData(newValue, currentPage.value);
    }, 500); // 500ms debounce for better UX
});

// Watch for page changes
watch(currentPage, (newPage) => {
    //console.log(currentPage,newPage);
    updateTableData(searchText.value, newPage);
});*/


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
                        "foo": {
                            "txt": ``,/*apiResponse?.success 
                                ? `Found ${apiResponse.data.found} products in ${apiResponse.data.search_time_ms}ms - Page ${apiResponse.data.page} of ${apiResponse.data.total_pages}`
                                : "Product Directory - Search for products"*/
                        },
                        "config": {
                            "search": {
                                "placeholder": "Search Products (e.g., Nike shirts, Adidas shoes)...",
                                "field": "name"
                            },
                            "filter": {
                                "label": "All Categories",
                                "field": "category"
                            },
                            "filterOptions": [
                                "Men",
                                "Women",
                                "Footwear",
                                "Apparel",
                                "Accessories"
                            ]
                        },
                        "table": {
                            "columns": [
                              { title: "#", field: "sno", hozAlign: "center", width: 60 },
                              { title: "Asset ID", field: "asset_id", width: 300, hozAlign: "left" },
                              { title: "Public ID", field: "public_id", width: 300, hozAlign: "left" },
                              { title: "Resource Type", field: "resource_type", width: 150, hozAlign: "left" },
                              { title: "URL", field: "url", formatter: "html", minWidth: 320, hozAlign: "left" },
                              { title: "Status", field: "status", formatter: "html", hozAlign: "center", width: 120 },
                              { title: "Action", field: "action", formatter: "html", hozAlign: "center", width: 120 }
                            ],
                            "rows": [],//apiRows
                        }
                    }
                },
                {
                    "id": "3e1bc78c-aa87-search-panel",
                    "type": "search_panel",
                    "slug": "search_panel",
                    "data": {
                        "data": "",
                        "placeholder": "Search..",
                        "show_sugg": false,
                        "size": "sm", //sm, md, xl
                        "class": "p-1 max-w-lg",//"p-1",
                        "sugg": [],
                        "map": {
                            "title": "title",
                            "label": "type"
                        }
                    }
                },
                {
                  id: "dialog-cnf_delete",
                  type: "dialog",
                  slug: "dialog",
                  data: {
                    label: "Confirm Delete",
                    visible: false,
                    modal: true,
                    class: "w-sm md:w-md",
                    positive: { label: "Ok" },
                    negative: { label: "Cancel" },
                    content: {
                      value: "<div>Are you sure you want to delete?</div>"
                    }
                  }
                }
            ]
        };

        // Store reference to table data
        //tableData.value = _data.l[0].data;

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
                  updateTableData(_$, searchText.value);
              }

              // search
              if (_$.type === 'search:query' && _$._$p.data.curr.id === '3e1bc78c-aa87-search-panel') {
                const raw = _$. _p.query?.trim();

                if (!raw) {
                  searchText.value = '';
                } else if (raw.includes(':')) {
                  searchText.value = raw; // power user
                } else if (raw.includes('/')) {
                  const path = raw.endsWith('/') ? raw : raw + '/';
                  searchText.value = `public_id:${path}*`;
                } else {
                  searchText.value = `public_id:${raw}*`;
                }

                ce_call('msg', {
                  type: 'remove_all_rows',
                  where: { key: 'id', value: '3e1bc78c-104f-4f6f-aa87-75' },
                });

                const _this_$p = {
                  data: { curr: _data.l[0] }
                };

                updateTableData(
                  { _p, _$p: _this_$p },
                  searchText.value,
                  true
                );
              }

              // delete
              if (_$.type === 'btn:positive' && _$._$p.data.curr.id === 'dialog-cnf_delete') {
                 if(!deleteRow) return;
                 await deleteFile(deleteRow.public_id, deleteRow.resource_type);
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
            _var.value.html.search_panel = _ce_renderer_rsp.r[1] || "";
            _var.value.html.dialog = _ce_renderer_rsp.r[2] || "";

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

        // action button column
        document.addEventListener('click', (e: any) => {
          const btn = e.target.closest('.delete-btn');
          if (!btn) return;

          const public_id = btn.dataset.public_id;
          const url = btn.dataset.url;
          const resource_type = btn.dataset.resource_type;

          // store selected item globally if needed
          deleteRow = { public_id, url, resource_type };
          
          ce_call('msg', {
            type: 'open',
            custom: {},
            _$p: {},
            _p: {},
            where: { key: 'id', value: 'dialog-cnf_delete' }
          });
        });
    })();
});

</script>