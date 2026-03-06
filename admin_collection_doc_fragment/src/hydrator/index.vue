<template>

    <div class="pb-3 pt-3 pl-3 pr-3 sticky top-0 bg-white z-10 flex justify-between items-center">
        <div v-if="_var.html.search_panel" v-html="_var.html.search_panel"></div>
        <div v-if="_var.html.form_autocomplete" v-html="_var.html.form_autocomplete"></div>
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
let currentPage = ref(1);
const selectedCollection = ref<any>(null);
const selectedEditRow = ref<any>(null);
const selectedDeleteRow = ref<any>(null);

//set..
const _var = ref({
    html:{
        table:null,
        search_panel:null,
        form_autocomplete:null,
        dialog:null
    }
});

// API Configuration
const API_CONFIG = {
    //url: 'https://fastapi.dryutil.1mn.io/client/api/i/ona/file_storage?typ=cloudinary&opr=search',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
};

// Function to fetch list
async function fetchCollectionData(collection: string) {
  try {
    const res = await fetch("https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=view_collection",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.token}`,
        },
        body: JSON.stringify({
          collection,
          body: {
            "q": "*",
            "query_by": "",
            "page": currentPage.value,
            "per_page": 20,
          },
        }),
      }
    );

    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// delete product by title
async function deleteCollectionDoc(collection: string, title: string) {
  try {
    const res = await fetch(
      "https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=delete_collection_doc",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.token}`,
        },
        body: JSON.stringify({
          collection,
          body: {
            q: title,
            query_by: "title",
            prioritize_exact_match: true,
            prefix: true,
          },
        }),
      }
    );

    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Convert API response to table rows
function convertApiDataToRows(api: any) {
  if (!api?.success || !api?.data?.documents) return [];
  const startIndex = (currentPage.value - 1) * 20;

  return api.data.documents.map((doc: any, index: number) => ({
    series: startIndex + index + 1, // ✅ running number
    id: doc.id,
    json: JSON.stringify(doc, null, 2), // full object
    action: `
      <div class="flex items-center justify-center gap-4">
        <button class="edit-btn px-2 py-1 rounded bg-green-100 text-green-700" data-id="${(doc.id)}">Edit</button>
        <button class="delete-btn px-2 py-1 rounded bg-red-100 text-red-700" data-title="${(doc.title)}">Delete</button>
      </div>
      `
  }));
}


onMounted(() => {
    (async () => {
        let _css_server = ``;
        let _css_client = ``;
        let _editor_html = ``;
        let _editor_css_client = ``;
        let _data : any = {
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
                              { title: "#", field: "series", width: 70 },
                              { title: "Id", field: "id", width: 320 },
                              { title: "Json", field: "json" },
                              { title: "Action", field: "action", formatter: "html", hozAlign: "center", width: 160 }
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
                  "id": "9568c-form_autocomplete",
                  "type": "form_autocomplete",
                  "slug": "form_autocomplete",
                  "data": {
                    "placeholder": "Select a collection",
                    "optionLabel": "name",
                    "showClear": false,
                    "dropdown": true,
                    "appendTo": "body",
                    "value": {},
                    "options": [],
                    "style": { "width": "15rem" },
                    "api": {
                      "url": "https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=list_collection",
                      "method": "post",
                      "rsp_path": "json.collections",
                      "body": {},
                      "headers": {
                        "accept": "application/json",
                        "Content-Type": "application/json",
                        //"Authorization": "Bearer <localStorage.token>"
                        "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk"
                      }
                    }
                  }
                },
                {
                  id: "dialog-edit",
                  type: "dialog",
                  slug: "dialog",
                  data: {
                    label: "Product JSON Edit",
                    visible: false,
                    modal: true,
                    class: "w-[90vw]",
                    positive: { label: "Ok" },
                    negative: { label: "Cancel" },
                    content: {
                      "ce_file": {
                        "config": {
                            "lazy_lib": {
                            "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/renderer.es.js",
                            "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/hydrator.es.js",
                            "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/editor.es.js"
                            }
                        },
                         data: {
                            "l": [
                                // form json edit section
                                {
                                  id: "section-form_json",
                                  type: "form_section",
                                  slug: "form_section",
                                  data: {
                                    label: "Product JSON",
                                    l: [],
                                    theme: "light"
                                  }
                                },
                                {
                                  id: "form_json",
                                  type: "form_json",
                                  "slug": "form_json",
                                  "data": {
                                      "form": {"section_id": "section-form_json"},
                                      "value": {},
                                      "class": "w-full h-[100px]"
                                  }
                                }
                             ]
                         },
                      },
                      //value: "<div>Are you sure you want to delete?</div>"
                    }
                  }
                },
                {
                  id: "dialog-delete",
                  type: "dialog",
                  slug: "dialog",
                  data: {
                    label: "Delete Product",
                    visible: false,
                    modal: true,
                    class: "w-sm md:w-md",
                    positive: { label: "Ok" },
                    negative: { label: "Cancel" },
                    content: {
                      "ce_file": {
                        "config": {
                            "lazy_lib": {
                            "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/renderer.es.js",
                            "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/hydrator.es.js",
                            "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/editor.es.js"
                            }
                        },
                        data: {}
                      },
                      value: "<div>Are you sure you want to delete?</div>"
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
            ce_listen('msg', async (_$: any) => {
              console.log(`[ce_listen]`, _$);

              // 🔹 LOAD MORE (auto pagination)
              if (_$.type === "load_more" && _$._$p.data.curr.id === "3e1bc78c-104f-4f6f-aa87-75" && selectedCollection.value) {

                currentPage.value++;

                const api = await fetchCollectionData(selectedCollection.value);
                if (!api?.success) return;

                const rows = convertApiDataToRows(api);

                _data.l[0].data.table.rows.push(...rows);

                const _this_$p = { data: { curr: _data.l[0] } };

                ce_call("msg", {
                  type: "load_more",
                  _p,
                  _$p: _this_$p,
                  where: { key: "id", value: "3e1bc78c-104f-4f6f-aa87-75" }
                });
              }

              // 🔹 AUTOCOMPLETE SELECT (first load)
              if (_$.type === "autocomplete:select" && _$._$p.data.curr.id === "9568c-form_autocomplete") {

                const collectionName = _$.custom?.selectedValue?.name;
                if (!collectionName) return;

                currentPage.value = 1;

                // store collection inside table object (no extra variable)
                selectedCollection.value = collectionName;

                const api = await fetchCollectionData(collectionName);
                if (!api?.success) return;

                const rows = convertApiDataToRows(api);

                // clear table
                ce_call("msg", {
                  type: "remove_all_rows",
                  where: { key: "id", value: "3e1bc78c-104f-4f6f-aa87-75" },
                });

                _data.l[0].data.table.rows = rows;

                const _this_$p = { data: { curr: _data.l[0] } };

                ce_call("msg", {
                  type: "load_more",
                  _p,
                  _$p: _this_$p,
                  where: { key: "id", value: "3e1bc78c-104f-4f6f-aa87-75" }
                });
              }

              // 🔹 DELETE PRODUCT
              if (_$.type === "btn:positive" && _$._$p.data.curr.id === "dialog-delete") {
                const api = await deleteCollectionDoc(selectedCollection.value, selectedDeleteRow.value);
                if (!api?.success) return;
                console.log('api success', api)

                // remove from table UI
                _data.l[0].data.table.rows =
                  _data.l[0].data.table.rows.filter((r: any) => r.title !== selectedDeleteRow.value);

                selectedDeleteRow.value = null;
              }

              // 🔹 UPDATE PRODUCT
              if (_$.type === "btn:positive" && _$._$p.data.curr.id === "dialog-edit") {
                console.log('btn positive updateee', selectedEditRow.value);
              }
            });
        })();

        const _run = async () => {
            const _ce_renderer_rsp = await _ce_renderer.set({
                data:_data,
                return:{
                    r:"chunk", //full, chunk
                }
            });
            //console.log(_html.value);

            //_html.value = _ce_renderer_rsp.r || "";
            _css_server = _ce_renderer_rsp.style;

            //set..
            _var.value.html.table = _ce_renderer_rsp.r[0] || "";
            _var.value.html.search_panel = _ce_renderer_rsp.r[1] || "";
            _var.value.html.form_autocomplete = _ce_renderer_rsp.r[2] || "";
            _var.value.html.dialog = (_ce_renderer_rsp.r[3] || "") + (_ce_renderer_rsp.r[4] || "");

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

        // action edit
        document.addEventListener('click', async (e: any) => {
          const btn = e.target.closest('.edit-btn');
          if (!btn) return;
          
          // get row id
          const id = btn.dataset.id;
          if (!id) return;
          
          // match row with id, and get row
          const row = _data.l[0].data.table.rows.find((r: any) => r.id === id);
          if (!row) return;

          // set selected row
          selectedEditRow.value = row.json;

          // find form_json from _data.l and inside dialog
          const dialog = _data.l.find((x: any) => x.id === "dialog-edit");
          const formJson = dialog.data.content.ce_file.data.l.find((x: any) => x.id === "form_json");
          
          // set form_json.data.value with our row.json object
          formJson.data.value = JSON.parse(row.json);

          // 🔹 Open dialog
          ce_call("msg", {
            type: "open",
            where: { key: "id", value: "dialog-edit" }
          });

          // hydrate to show ce file in dailog
          await _ce_hydrator.set({
            data: { l: [_data.l.find((x: any) => x.id === 'dialog-edit')]}
          });
        });
        
        // action delete
        document.addEventListener('click', async (e: any) => {
          const btn = e.target.closest('.delete-btn');
          if (!btn) return;
          
          const title = btn.dataset.title;
          if (!title) return;
          
          selectedDeleteRow.value = title;

          // 🔹 Open dialog
          ce_call("msg", {
            type: "open",
            where: { key: "id", value: "dialog-delete" }
          });
        });
    })();
});

</script>