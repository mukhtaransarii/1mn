<template>
    <div v-if="_html">  
      <div v-html="_html">
      </div>
    </div>
    <div v-if="fileurlres" class="mt-2 text-xs flex items-center gap-2">
      <span class="text-gray-400">Response:</span>
      <span class="text-blue-500 truncate max-w-xs">{{ fileurlres }}</span>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref, watch } from 'vue'
    import type { _p_TYP, _$p_TYP } from "../shared/types";
    import { ce_renderer, ce_hydrator, ce_listen, ce_call } from "content-engine-lib";
    import { useApi } from "./src/composable/useApi";

    const {_p,_$p} = defineProps<{
        _p:_p_TYP,
        _$p:_$p_TYP,
    }>();
    
    const url = "https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=upload_collection";
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk";
    
    const uploadedFiles = ref([]);
    const fileurlres = ref('');
    const collectionName = ref(''); 
    const schema = ref<any>(null); 
    
    // Api call
    const { post, loading, error } = useApi();

    // --- TOAST HELPER FUNCTION ---
    const showToast = async (msg: string, type: 'success' | 'error' | 'warn' | 'info' = 'info') => {
        await ce_call("msg", {
            type: "show",
            _p: {},
            _$p: {},
            custom: {
                msg: msg,
                options: {
                    type: type, 
                    position: "top-right",
                    autoClose: 3000,
                    theme: 'light',
                }
            }
        });
    }

    const submit = async () => {

      console.log("schema", schema.value)
      // Validation Toast
      if (!uploadedFiles.value.length) return showToast("Please select a file first", "warn");
      const file : any = uploadedFiles.value[0];
      const formData = new FormData();
      
      formData.append("file", file);
      if (collectionName.value) formData.append("collection", collectionName.value)
      if (schema.value) formData.append("schema", schema.value)

      showToast("Uploading...", "info"); // Show progress toast

      const data = await post(url, formData, token);
      
      // Error Toast
      if(!data) {
          showToast(`Error: ${error.value || 'Upload failed'}`, "error");
          return console.log('Error uploading collection:', error.value);
      }

      console.log('Collection upload response:', data);
      
      // Success Toast
      fileurlres.value = data.message || "Upload Successful";
      showToast("File uploaded successfully!", "success");
    }

    const _html : any = ref(null);

    onMounted(() => {
        (async () => {
        let _css_server = ``;
        let _data = {
            l: [        
                   // --- 1. TOAST COMPONENT ADDED HERE ---
                   {
                        "id": "c78c-form_toast",
                        "type": "form_toast",
                        "slug": "form_toast",
                        "data": {
                            "env": "prod"
                        }
                   },
                   // --- 2. MAIN FORM HOLDER ---
                   {
                      "id": "c78c-form_holder",
                      "type": "form_holder",
                      "slug": "form_holder",
                      "data": {
                          "title": "Bulk Collection Upload",
                          "mode": "manual",
                          "class": {
                            "b": "bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
                          },
                          "ce_file": {
                              "data": {
                                  "l": [
                                  // Collection Name Input
                                  {
                                    "id": "section-collection-id",
                                    "type": "form_section",
                                    "slug": "form_section",
                                    "data": {
                                        "label": "Collection Name (Optional)",
                                        "l": [],
                                        "theme": "light"
                                    }
                                  },
                                  {
                                    "id": "input-collection-id",
                                    "type": "form_inputtext",
                                    "slug": "form_inputtext",
                                    "data": {
                                        "value": "",
                                        "placeholder": "e.g. products_backup",
                                        "style": {},
                                        "class": "w-auto",
                                        "variant": "outlined",
                                        "form": { "section_id": "section-collection-id" }
                                    },
                                  },
                                  {
                                      "id": "form_section-fileupload",
                                      "type": "form_section",
                                      "slug": "form_section",
                                      "data": {
                                          "label": "Select JSON/Excel/CSV File",
                                          "l": [],
                                          "theme": "light"
                                      }
                                  },
                                  {
                                      "id": "form_fileupload",
                                      "type": "form_fileupload",
                                      "slug": "form_fileupload",
                                      "data": {
                                          "url": "/api/upload",
                                          "multiple": false,
                                          "accept": ".json,.csv,.xlsx,.xls",
                                          "maxFileSize": 50000000, 
                                          "auto": false,
                                          "emptyText": "Drop your data file here",
                                          "class": "w-auto",
                                          "mode": "advanced",
                                          "customUpload": true,
                                          "form": {"section_id": "form_section-fileupload"}
                                      }
                                  },
                                  {
                                      "id": "form_section-schema",
                                      "type": "form_section",
                                      "slug": "form_section",
                                      "data": { "label": "", "l": [], "theme": "light" }
                                  },
                                  {
                                      "id": "form_json-schema",
                                      "type": "form_json",
                                      "slug": "form_json",
                                      "data": {
                                          "value": {},
                                          "class": "w-[300px] h-[100px]",
                                          "form": {"section_id": "form_section-schema"}
                                      }
                                  },
                                  {
                                      "id": "form_section-button",
                                      "type": "form_section",
                                      "slug": "form_section",
                                      "data": { "label": "", "l": [], "theme": "light" }
                                  },
                                  {
                                      "id": "form_button",
                                      "type": "form_button",
                                      "slug": "form_button",
                                      "data": {
                                          "label": "Start Bulk Upload",
                                          "form": {"section_id": "form_section-button"}
                                      }
                                  }
                               ]
                              }
                          }
                      }
                   } 
            ]
        };

        const _cnf = {
            lib:[],
            lazy_lib: {
                "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/renderer.es.js",
                "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/hydrator.es.js",
                "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/editor.es.js"
            }
        };

        const _ce_renderer = await ce_renderer(_cnf);
        const _ce_hydrator = await ce_hydrator(_cnf);
        
        ce_listen("child:msg" as any, async(_$: any)=>{
            if (_$.type === 'fileUpload:uploader') {
                uploadedFiles.value = _$.custom?.event?.files || [];
            }
            if (_$.type === "inputText:value" && _$._$p.data.curr.id === "input-collection-id") {
                collectionName.value = _$.custom.value;
            }

            if (_$.type === "json:value" && _$._$p.data.curr.id === "form_json-schema") {
                schema.value = _$.custom.value;
                console.log("schma ", schema.value)
            }

            if (_$.type === 'click') {
                submit();
            }
        });

        const _run = async () => {
            const _ce_renderer_rsp =  await _ce_renderer.set({ data:_data });
            _html.value = _ce_renderer_rsp.r || "";
            _css_server = _ce_renderer_rsp.style;

            const mS = document.createElement('style');
            document.head.appendChild(mS);
            mS.innerHTML = _css_server;

            setTimeout(async() => {
                await _ce_hydrator.set({ data:_data });
            }, 200);
        }
        await _run();
        })();
    })
</script>