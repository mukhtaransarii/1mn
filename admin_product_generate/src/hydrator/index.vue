<template>
    <div v-if="_html">  
      <div v-html="_html">
      </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from 'vue'
    import type { _p_TYP, _$p_TYP } from "../shared/types";
    import { ce_renderer, ce_hydrator, ce_listen, ce_call } from "content-engine-lib";
    import { useApi } from "./src/composable/useApi";

    const {_p,_$p} = defineProps<{
        _p:_p_TYP,
        _$p:_$p_TYP,
    }>();
    
    // const url = "https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=create_product_with_genai";
    // const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk";

    // const payload = ref<any>({
    //   search: "",
    //   limit: 0,
    //   auto_upload: false,
    //   genai_type: "",
    //   genai_secret: ""
    // });

    // // Api call
    // const { post, loading, error } = useApi();

    // const submit = async () => {
    //   const p = payload.value;

    //   if (!p.search.trim() || !p.genai_type.trim() || !p.genai_secret.trim() || p.limit <= 0) {
    //     return alert("Please fill all required fields correctly");
    //   }

    //   const data = await post(url, p, token);

    //   if(!data?.success) return;
    //   alert(data?.message);
    // };


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
            l:  [        
                  // {
                  //     "id": "c78c-form_holder",
                  //     "type": "form_holder",
                  //     "slug": "form_holder",
                  //     "data": {
                  //         "title": "Create Product with GenAI",
                  //         "ce_file": {
                  //             "data": {
                  //                 "l": [
                  //                   // 🔎 Search Keyword Section
                  //                   {
                  //                     "id": "form_section-search",
                  //                     "type": "form_section",
                  //                     "slug": "form_section",
                  //                     "data": {
                  //                       "label": "Search Keyword",
                  //                       "l": [],
                  //                       "theme": "light"
                  //                     }
                  //                   },
                  //                   {
                  //                     "id": "search",
                  //                     "type": "form_inputtext",
                  //                     "slug": "form_inputtext",
                  //                     "data": {
                  //                       "form": { "section_id": "form_section-search" },
                  //                       "placeholder": "Enter search keyword",
                  //                       "variant": "outlined"
                  //                     }
                  //                   },
                  //                   // 🔢 Limit Section
                  //                   {
                  //                     "id": "form_section-limit",
                  //                     "type": "form_section",
                  //                     "slug": "form_section",
                  //                     "data": {
                  //                       "label": "Result Limit",
                  //                       "l": [],
                  //                       "theme": "light"
                  //                     }
                  //                   },
                  //                   {
                  //                     "id": "limit",
                  //                     "type": "form_inputtext",
                  //                     "slug": "form_inputtext",
                  //                     "data": {
                  //                       "form": { "section_id": "form_section-limit" },
                  //                       "placeholder": "Enter result limit",
                  //                       "input_type": "number",
                  //                       "variant": "outlined"
                  //                     }
                  //                   },
                  //                   // 📤 Auto Upload Section
                  //                   {
                  //                     "id": "form_section-auto_upload",
                  //                     "type": "form_section",
                  //                     "slug": "form_section",
                  //                     "data": {
                  //                       "label": "Auto Upload",
                  //                       "l": [],
                  //                       "theme": "light"
                  //                     }
                  //                   },
                  //                   {
                  //                     "id": "auto_upload",
                  //                     "type": "form_inputtext",
                  //                     "slug": "form_inputtext",
                  //                     "data": {
                  //                       "form": { "section_id": "form_section-auto_upload" },
                  //                       "placeholder": "Enter true or false",
                  //                       "variant": "outlined"
                  //                     }
                  //                   },
                  //                   // 🤖 GenAI Type Section
                  //                   {
                  //                     "id": "form_section-genai_type",
                  //                     "type": "form_section",
                  //                     "slug": "form_section",
                  //                     "data": {
                  //                       "label": "GenAI Type",
                  //                       "l": [],
                  //                       "theme": "light"
                  //                     }
                  //                   },
                  //                   {
                  //                     "id": "genai_type",
                  //                     "type": "form_inputtext",
                  //                     "slug": "form_inputtext",
                  //                     "data": {
                  //                       "form": { "section_id": "form_section-genai_type" },
                  //                       "placeholder": "Enter GenAI type",
                  //                       "variant": "outlined"
                  //                     }
                  //                   },
                  //                   // 🔐 GenAI Secret Section
                  //                   {
                  //                     "id": "form_section-genai_secret",
                  //                     "type": "form_section",
                  //                     "slug": "form_section",
                  //                     "data": {
                  //                       "label": "GenAI Secret Key",
                  //                       "l": [],
                  //                       "theme": "light"
                  //                     }
                  //                   },
                  //                   {
                  //                     "id": "genai_secret",
                  //                     "type": "form_inputtext",
                  //                     "slug": "form_inputtext",
                  //                     "data": {
                  //                       "form": { "section_id": "form_section-genai_secret" },
                  //                       "placeholder": "Enter secret key",
                  //                       "variant": "outlined"
                  //                     }
                  //                   },
                  //                   // button
                  //                   {
                  //                       "id": "form_section-button",
                  //                       "type": "form_section",
                  //                       "slug": "form_section",
                  //                       "data": {
                  //                           "label": "",
                  //                           "l": [],
                  //                           "theme": "light"
                  //                       }
                  //                   },
                  //                   {
                  //                       "id": "868c-form_button",
                  //                       "type": "form_button",
                  //                       "slug": "form_button",
                  //                       "data": {
                  //                           "label": "Submit",
                  //                           "form": {
                  //                               "section_id": "form_section-button"
                  //                           }
                  //                       }
                  //                   }
                  //                 ]
                  //             }
                  //         }
                  //     }
                  // }

                  // NEW VERSION OF FORM_HOLDER API INBUILT FIELD.
                  {
                    "id": "c78c-form_holder",
                    "type": "form_holder",
                    "slug": "form_holder",
                    "data": {
                      "title": "Create Product with GenAI",
                      "mode": "auto",
                      "event": {
                        "l": [
                          {
                            "name": "request_body",
                            "typ": "body",
                            "data": "<body>"
                          },
                          {
                            "name": "submit",
                            "typ": "api",
                            "data": {
                              "url": "https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=create_product_with_genai",
                              "method": "POST",
                              "headers": {
                                "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk",
                                "Content-Type": "application/json"
                              }
                            }
                          }
                        ]
                      },
                      "ce_file": {
                        "data": {
                          "l": [
                            {
                              "id": "form_section-search",
                              "type": "form_section",
                              "slug": "form_section",
                              "data": {
                                "label": "Search Keyword",
                                "l": [],
                                "theme": "light"
                              }
                            },
                            {
                              "id": "search",
                              "type": "form_inputtext",
                              "slug": "form_inputtext",
                              "data": {
                                "form": { 
                                  "section_id": "form_section-search",
                                  "body_key": "search"
                                },
                                "placeholder": "Enter search keyword",
                                "variant": "outlined"
                              }
                            },

                            {
                              "id": "form_section-limit",
                              "type": "form_section",
                              "slug": "form_section",
                              "data": {
                                "label": "Result Limit",
                                "l": [],
                                "theme": "light"
                              }
                            },
                            {
                              "id": "limit",
                              "type": "form_inputtext",
                              "slug": "form_inputtext",
                              "data": {
                                "form": { 
                                  "section_id": "form_section-limit",
                                  "body_key": "limit",
                                },
                                "placeholder": "Enter result limit",
                                "input_type": "number",
                                "variant": "outlined"
                              }
                            },

                            {
                              "id": "form_section-auto_upload",
                              "type": "form_section",
                              "slug": "form_section",
                              "data": {
                                "label": "Auto Upload",
                                "l": [],
                                "theme": "light"
                              }
                            },
                            {
                              "id": "auto_upload",
                              "type": "form_inputtext",
                              "slug": "form_inputtext",
                              "data": {
                                "form": { 
                                  "section_id": "form_section-auto_upload",
                                  "body_key": "auto_upload",
                                },
                                "placeholder": "Enter true or false",
                                "variant": "outlined"
                              }
                            },

                            {
                              "id": "form_section-genai_type",
                              "type": "form_section",
                              "slug": "form_section",
                              "data": {
                                "label": "GenAI Type",
                                "l": [],
                                "theme": "light"
                              }
                            },
                            {
                              "id": "genai_type",
                              "type": "form_inputtext",
                              "slug": "form_inputtext",
                              "data": {
                                "form": { 
                                  "section_id": "form_section-genai_type",
                                  "body_key": "genai_type", 
                                },
                                "placeholder": "Enter GenAI type",
                                "variant": "outlined"
                              }
                            },

                            {
                              "id": "form_section-genai_secret",
                              "type": "form_section",
                              "slug": "form_section",
                              "data": {
                                "label": "GenAI Secret Key",
                                "l": [],
                                "theme": "light"
                              }
                            },
                            {
                              "id": "genai_secret",
                              "type": "form_inputtext",
                              "slug": "form_inputtext",
                              "data": {
                                "form": { 
                                  "section_id": "form_section-genai_secret",
                                  "body_key": "genai_secret", 
                                },
                                "placeholder": "Enter secret key",
                                "variant": "outlined"
                              }
                            },

                            {
                              "id": "form_section-button",
                              "type": "form_section",
                              "slug": "form_section",
                              "data": {
                                "label": "",
                                "l": [],
                                "theme": "light"
                              }
                            },
                            {
                              "id": "868c-form_button",
                              "type": "form_button",
                              "slug": "form_button",
                              "data": {
                                "label": "Submit",
                                "form": {
                                  "section_id": "form_section-button",
                                  "event": {
                                    "l": [
                                      {
                                        "on": "click",
                                        "call": [
                                          "request_body",
                                          "submit"
                                        ]
                                      }
                                    ]
                                  }
                                }
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

        //set..
        const _ce_renderer = await ce_renderer(_cnf);
        const _ce_hydrator = await ce_hydrator(_cnf);
        

        // pasted from https://github.com/1mn-io/mn-app/blob/main/modules/table/test/test_1.ts line:[120 - 141]
        (async()=>{
            ce_listen("msg", async(_$: any)=>{
                console.log(`[ce_listen]`,_$);
                
                // if (_$.type === "inputText:value") {
                //   const id = _$. _$p?.data?.curr?.id;
                //   const value = _$.custom?.value;

                //   if (id && id in payload.value) {
                //     if (id === "limit") {
                //       payload.value.limit = Number(value);
                //     } 
                //     else if (id === "auto_upload") {
                //       payload.value.auto_upload = value === "true";
                //     } 
                //     else {
                //       payload.value[id] = value;
                //     }
                //   }

                //   console.log("Updated payload:", payload.value);
                // }

                // // on submit button click
                //if (_$.type === 'click') submit();
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
