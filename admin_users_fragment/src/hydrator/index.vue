<template>
    <div class="pb-3 pt-3 pl-3 pr-3 sticky top-0 bg-white z-10" v-if="_var.html.search_panel">
        <div >
        <div v-html="_var.html.search_panel"></div>
        </div>
    </div>
    <div  v-if="_var.html.table">
        <div v-html="_var.html.table"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { _p_TYP, _$p_TYP } from "../shared/types";
import { ce_renderer, ce_hydrator, ce_listen, ce_call } from "content-engine-lib";

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

const _html : any = ref(null);
const searchText = ref(''); //ref('Nike shirts'); // Reactive search text
const currentPage = ref(1); //ref(1); // Current page
const perPage = ref(20); // Items per page
//const tableData:any = ref(null); // Store table data reference

//set..
const _var = ref({
    html:{
        table:null,
        search_panel:null,
    }
});

// API Configuration
const API_CONFIG = {
    url: 'https://fastapi.dryutil.1mn.io/client/api/i/ona/auth?typ=get_users',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
};

// Function to fetch list
async function fetchList(page: number = 1, per_page: number = 20, searchQuery: string = '') {
    try {
        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.token}`
            },
            body: JSON.stringify({
                page,
                page_size: per_page,
                email: searchQuery
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product list:', error);
        return null;
    }
}

// Convert API response to table rows
function convertApiDataToRows(api: any) {
  if (!api?.success) return [];

  return api.data.users.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    verified: u.verified ? "Yes" : "No",
  }));
}


// Update table with new data
async function updateTableData(_$:any, searchQuery: string, page: number = 1) {
    const apiResponse = await fetchList(page, perPage.value, searchQuery);
    
    if (apiResponse && apiResponse.success) {
        const newRows = convertApiDataToRows(apiResponse);

        try {
        if (newRows.length>0) {}else{ throw new Error("no more data..");}
        } catch (err) { 
        return;
        }
        //all ok..
        
        //if (tableData.value) {
            //tableData.value.table.rows = newRows;
            
            // Update footer with pagination info
            //const { found, total_pages, search_time_ms } = apiResponse.data;
            //tableData.value.foo.txt = `Found ${found} products in ${search_time_ms}ms - Page ${page} of ${total_pages}`;

            //console.log(newRows);
            //update..
            _$._$p.data.curr.data.table.rows = newRows;

            
            // Trigger update via content engine
            ce_call("msg", {
                type: `load_more`,
                _p:  _$._p,
                _$p: _$._$p,
                custom: { 
                    searchText: searchQuery,
                    page: page,
                    //totalPages: total_pages,
                    //found: found
                },
                where: {
                    key: `id`,
                    value: `3e1bc78c-104f-4f6f-aa87-75`,
                }
            });
        //}


    }
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
                            "txt": ``,
                            /*apiResponse?.success 
                                ? `Found ${apiResponse.data.found} products in ${apiResponse.data.search_time_ms}ms - Page ${apiResponse.data.page} of ${apiResponse.data.total_pages}`
                                : "Product Directory - Search for products"*/
                        },
                        "config": {
                            "search": {
                                "placeholder": "Search by email",
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
                            // config
                            "columns": [
                                {
                                    title: "name",
                                    field: "name",
                                    hozAlign: "center",
                                    width: 120,
                                },
                                {
                                    title: "email",
                                    field: "email",
                                    hozAlign: "center",
                                    minWidth: 250,
                                },
                                {
                                    title: "verified",
                                    field: "verified",
                                    hozAlign: "center",
                                    width: 110,
                                }
                            ],
                            "rows": [],
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
            ce_listen("msg", async(_$)=>{
                console.log(`[ce_listen]`,_$);
                if (_$.type==`load_more` && _$._$p.data.curr.id==`3e1bc78c-104f-4f6f-aa87-75`) {
                    currentPage.value += 1;

                    //set..
                    updateTableData(_$, searchText.value, currentPage.value);

                }
                if (_$.type==`search:query` && _$._$p.data.curr.id==`3e1bc78c-aa87-search-panel`) {

                    //reset..
                    ce_call("msg", {
                        type: `remove_all_rows`,
                        custom: {},
                        where: {
                            key: `id`,
                            value: `3e1bc78c-104f-4f6f-aa87-75`,
                        }
                    });
                    //reset..
                    currentPage.value = 1;


                    
                    //update..
                    // searchText.value = _$._p[`query`];
                    searchText.value = _$._p?.value || "";
                    console.log(_$._p);

                    //set..
                    let _this_$p = JSON.parse(JSON.stringify({
                        data:{
                            curr:_data.l[0]
                        }
                    }));
                    //console.log(_this_$p);
                    updateTableData({
                        type:`load_more`,
                        _$p:_this_$p,
                        _p:_p,
                        custom:{},
                    }, searchText.value, currentPage.value);
                    console.log();
                    

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