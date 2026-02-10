<template>
    <div v-if="_html">  
      <div v-html="_html">
      </div>
    </div>
    <div v-if="fileurlres" class="mt-2 text-xs flex items-center gap-2">
      <span class="text-gray-400">Uploaded:</span>
      <a
        :href="fileurlres"
        target="_blank"
        class="text-blue-500 hover:underline truncate max-w-xs"
      >
        {{ fileurlres }} 
      </a>
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
    
    const url = "https://fastapi.dryutil.1mn.io/client/api/i/ona/file_storage?typ=cloudinary&opr=upload_file";
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk";
    const uploadedFiles = ref([]);
    const fileurlres = ref('');
    const productId = ref('');


    // Api call
    const { post, loading, error } = useApi();

    const submit = async () => {
      if (!uploadedFiles.value.length) return console.log('No file selected');
      if (!productId.value) return console.log("Product ID missing");
     

       const file : any = uploadedFiles.value[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("public_id", productId.value);
      formData.append("eager", "w_400,h_300,c_pad|w_260,h_200,c_crop");

      const data = await post(url, formData, token);
      if(!data) return console.log('Error uploading product:', error.value);

      console.log('product upload response:', data);
      data.data.url && (fileurlres.value = data.data.url);
    }



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
                  /* {
                      "id": "c78c-form_holder",
                      "type": "form_holder",
                      "slug": "form_holder",
                      "data": {
                          "title": "Bulk product upload",
                          "ce_file": {
                              "data": {
                                  "l": [
                                      {
                                          "id": "3e1bc78c-form_section",
                                          "type": "form_section",
                                          "slug": "form_section",
                                          "data": {
                                              "label": "Select JSON File",
                                              "l": [],
                                              "theme": "light"
                                          }
                                      },
                                      {
                                          "id": "bc78c-form_fileupload",
                                          "type": "form_fileupload",
                                          "slug": "form_fileupload",
                                          "data": {
                                              "data": "Hello world! ",
                                              "url": "/api/upload",
                                              "multiple": true,
                                              "accept": ".json",
                                              "maxFileSize": 20000000, 
                                              "auto": false,
                                              "emptyText": "Drag and drop files here to upload",
                                              "style": {},
                                              "class": "w-full",
                                              "mode": "advanced",
                                              "name": "fileUpload[]",
                                              "customUpload": true,
                                              "form": {
                                                  "section_id": "3e1bc78c-form_section"
                                              }
                                          }
                                      },
                                      {
                                          "id": "47c-form_section",
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
                                                  "section_id": "47c-form_section"
                                              }
                                          }
                                      }
                                  ]
                              }
                          }
                      }
                  } */
                  // Product id [form_section] && [form_inputtext]
                  {
                    "id": "section-product-id",
                    "type": "form_section",
                    "slug": "form_section",
                    "data": {
                        "label": "Product title",
                        "l": [],
                        "theme": "light"
                    }
                  },
                  {
                    "id": "input-product-id",
                    "type": "form_inputtext",
                    "slug": "form_inputtext",
                    "data": {
                        "value": "",
                        "placeholder": "Enter title",
                        "style": {},
                        "class": "",
                        "variant": "outlined",
                        "form": {
                          "section_id": "section-product-id",
                        }
                    },
                  },
                  {
                      "id": "form_section-fileupload",
                      "type": "form_section",
                      "slug": "form_section",
                      "data": {
                          "label": "Select File",
                          "l": [],
                          "theme": "light"
                      }
                  },
                  {
                      "id": "form_fileupload",
                      "type": "form_fileupload",
                      "slug": "form_fileupload",
                      "data": {
                          "data": "Hello world! ",
                          "url": "/api/upload",
                          "multiple": true,
                          "accept": "image/*,video/*,application/pdf,.zip,.rar,.7z,.json,.csv,.xlsx,.xls,.doc,.docx,.txt",
                          "maxFileSize": 20000000, 
                          "auto": false,
                          "emptyText": "Drag and drop files here to upload",
                          "style": {},
                          "class": "w-full",
                          "mode": "advanced",
                          "name": "fileUpload[]",
                          "customUpload": true,
                          "form": {"section_id": "form_section-fileupload"}
                      }
                  },
                //   {
                //       "id": "form_section-url",
                //       "type": "form_section",
                //       "slug": "form_section",
                //       "data": {
                //           "label": fileurlres.value,
                //           "l": [],
                //           "theme": "light"
                //       }
                //   },
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
                      "id": "form_button",
                      "type": "form_button",
                      "slug": "form_button",
                      "data": {
                          "label": "Submit",
                          "form": {"section_id": "form_section-button"}
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
                
                // getting uploaded files
                if (_$.type === 'fileUpload:uploader') {
                  uploadedFiles.value = _$.custom?.event?.files || [];
                  console.log('Files upload:', uploadedFiles.value);
                }

                // 👇 INPUT TEXT CHANGE
                if (_$.type === "inputText:value" && _$._$p.data.curr.id === "input-product-id") {
                  productId.value = _$.custom.value;
                }

                // on submit button click
                if (_$.type === 'click') {
                  submit();
                }
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
