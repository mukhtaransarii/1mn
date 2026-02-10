<template>
    <div v-if="_html">  
      <div v-html="_html">
      </div>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, ref, reactive } from 'vue'
    import type { _p_TYP, _$p_TYP } from "../shared/types";
    import { ce_renderer, ce_hydrator, ce_listen, ce_call } from "content-engine-lib";
    import { useApi } from "./src/composable/useApi";
    const {_p,_$p} = defineProps<{ _p:_p_TYP, _$p:_$p_TYP,}>();


    // ================= VARIABLE DEFINE =================
    const inputMap: Record<string, string> = {};
    const datatableMap: Record<string, any[]> = {};

    const payload: any = {
      // collection: "products",
      collection: "",

      l: [
        {
          title: "",
          url: "",
          size: [],
          brand: "",
          color: [],
          field: [],
          seller: {},
          variant: [],
          category: [],
          size_info: {
            chart: { url: null },
            representation: { url: "" }
          },
          hashtags: [],
          lang: "en"
        }
      ]
    };

    const url = "https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=product_create";
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk";

    // ================= CREATE PRODUCT API =================
    const { post, loading, error } = useApi();

    const createProduct = async () => {
      const data: any = await post(url, payload, token);

      if (!data?.success) return showToast(data?.message || "Product creation failed", "error");
      showToast("Product created successfully 🎉", "success");

      console.log('product created', data);
    }


    // ================= UTILS =================
    const syncState = (_$: any) => {
      const curr = _$._$p?.data?.curr;
      if (!curr) return;

      const genId = () => crypto.randomUUID();

      // inputText
      if (_$.type === "inputText:value") {
        inputMap[curr.id] = _$.custom.value;
      }

      // datatable
      if (
        _$.type === "datatable:cell-edit" ||
        _$.type === "datatable:add-row" ||
        _$.type === "datatable:delete-row"
      ) {
        const rows = curr.data.rows || [];
        rows.forEach((r: any) => r._uid ||= genId());
        datatableMap[curr.id] = rows;
      }
    };

    const buildProduct = () => {
      const product = payload.l[0];

      // inputText
      product.collection = inputMap["input-collection"] || "products";
      product.title = inputMap["input-title"] || "";
      product.url = inputMap["input-image-url"] || "";
      product.brand = inputMap["input-brand-name"] || "";
      product.lang = "en";

      // size
      product.size = (datatableMap["form_datatable-size"] || []).map((r: any) => ({
        id: r._uid,
        name: r.sizename,
        measurements: [{ name: r.name, unit: r.unit, value: r.value }]
      }));

      // color
      product.color = (datatableMap["form_datatable-color"] || []).map((r: any) => ({
        id: r._uid,
        name: r.name,
        image: [{ url: r.imageurl }],
        video: []
      }));

      // field
      const fieldRows = datatableMap["form_datatable-field"] || [];
      product.field = ["detail", "info"].map(typ => ({
        typ,
        l: fieldRows
          .filter((f: any) => f.typ === typ)
          .map((f: any) => ({ name: f.name, value: f.value }))
      }));

      // seller
      const s = datatableMap["form_datatable-seller"]?.[0];
      if (s) {
        product.seller = {
          name: s.name,
          packer_info: s.packer_info,
          importer_info: s.importer_info,
          country_of_origin: [s.country_of_origin],
          manufacturer_info: s.manufacturer_info
        };
      }

      // variant (IMPORTANT PART)
      product.variant = (datatableMap["form_datatable-variant"] || []).map(v => ({
        id: v._uid,
        price: String(v.price),
        price_mrp: String(v.price_mrp),
        currency: v.currency,
        size_id: v.size_id,
        color_id: v.color_id
      }));



      // category
      product.category = datatableMap["form_datatable-category"] || [];

      // size info
      const si = datatableMap["form_datatable-size-info"]?.[0];
      if (si) {
        product.size_info.chart.url = si.chart_url || null;
        product.size_info.representation.url = si.representation_url || "";
      }

      // hashtags
      product.hashtags = (datatableMap["form_datatable-hashtags"] || []).map((r: any) => r.hashtag);

     console.log('product', product);
    };

    const isFormFilled = () => {
      const p = payload.l[0];

      if (!p.title) return showToast("Title is required", "warn"), false;
      if (!p.url) return showToast("Image URL is required", "warn"), false;
      if (!p.brand) return showToast("Brand is required", "warn"), false;
      if (!p.size.length) return showToast("At least one size required", "warn"), false;
      if (!p.color.length) return showToast("At least one color required", "warn"), false;
      if (!p.variant.length) return showToast("At least one variant required", "warn"), false;
      if (!p.category.length) return showToast("Category is required", "warn"), false;
      if (!p.hashtags.length) return showToast("Hashtag required", "warn"), false;

      if (!p.variant.every((v: any) => v.size_id && v.color_id)) {
        showToast("Variant size/color mismatch", "error");
        return false;
      }

      return true;
    };


    const showToast = ( msg: string, type: "success" | "error" | "warn" | "info" = "info" ) => {
      ce_call("msg", {
        type: "show",
        _p: {},
        _$p: {},
        custom: {
          msg,
          options: {
            type,
            position: "top-right",
            autoClose: 5000,
            theme: "light",
          }
        }
      });
    };







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
                   {
                      "id": "c78c-form_holder",
                      "type": "form_holder",
                      "slug": "form_holder",
                      "data": {
                          "title": "Admin product upsert",
                          "mode": "manual",
                          "ce_file": {
                              "data": {
                                  "l": [  
                                          // Product collection [form_section] && [form_inputtext]
                                          {
                                            "id": "section-collection",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": {
                                                "label": "Product collection",
                                                "l": [],
                                                "theme": "light"
                                            }
                                          },
                                          {
                                            "id": "input-collection",
                                            "type": "form_inputtext",
                                            "slug": "form_inputtext",
                                            "data": {
                                                "value": "products",
                                                "placeholder": "Enter collection",
                                                "style": {},
                                                "class": "",
                                                "variant": "outlined",
                                                "form": {
                                                  "section_id": "section-collection",
                                                }
                                            },
                                          },
                                          // Product title [form_section] && [form_inputtext]
                                          {
                                            "id": "section-title",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": {
                                                "label": "Product title",
                                                "l": [],
                                                "theme": "light"
                                            }
                                          },
                                          {
                                            "id": "input-title",
                                            "type": "form_inputtext",
                                            "slug": "form_inputtext",
                                            "data": {
                                                "value": "",
                                                "placeholder": "Enter title",
                                                "style": {},
                                                "class": "",
                                                "variant": "outlined",
                                                "form": {
                                                  "section_id": "section-title",
                                                }
                                            },
                                          },
                                          // Product image url [form_section] && [form_inputtext]
                                          {
                                            "id": "section-url",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": {
                                                "label": "Product image url",
                                                "l": [],
                                                "theme": "light"
                                            }
                                          },
                                          {
                                            "id": "input-image-url",
                                            "type": "form_inputtext",
                                            "slug": "form_inputtext",
                                            "data": {
                                                "value": "",
                                                "placeholder": "Enter image url",
                                                "style": {},
                                                "class": "",
                                                "variant": "outlined",
                                                "form": {
                                                  "section_id": "section-url",
                                                }
                                            },
                                          },
                                          // Product sizes [form_section] && [form_datatable]
                                          {
                                            "id": "section-size",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": {
                                                "label": "Product sizes",
                                                "l": [],
                                                "theme": "light"
                                            }
                                          },
                                          {
                                            "id": "form_datatable-size",
                                            "type": "form_datatable",
                                            "slug": "form_datatable",
                                            "data": {
                                              "form": {"section_id": "section-size"},
                                              "columns": [
                                                  // {"field": "sizeid", "header": "Size id", "style": ""},
                                                  {"field": "sizename", "header": "Size name", "style": ""},
                                                  {"field": "name", "header": "Name", "style": ""},
                                                  {"field": "unit", "header": "Unit", "style": ""},
                                                  {"field": "value", "header": "Value", "style": ""}
                                              ],
                                              "rows": [
                                                  // {"sizeid": "XL", "sizename": "Nike Shirt", "name": "width", "unit": "inch", "value": 10},
                                                  // {"sizeid": "SM", "sizename": "Adidas Tee", "name": "height", "unit": "cm", "value": 5}
                                              ],
                                              "pt": { 
                                                  "table": {"style": "min-width: 50rem; table-layout:fixed"},
                                                  "column": {}
                                              },
                                              "addrow": true,
                                              "deleterow": true
                                            }
                                          },
                                          // Product brand [form_section] && [form_inputtext]
                                          {
                                            "id": "section-brand",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": {
                                                "label": "Brand",
                                                "l": [],
                                                "theme": "light",
                                                
                                            }
                                          },
                                          {
                                            "id": "input-brand-name",
                                            "type": "form_inputtext",
                                            "slug": "form_inputtext",
                                            "data": {
                                                "value": "",
                                                "placeholder": "Enter product brand",
                                                "style": {},
                                                "class": "",
                                                "variant": "outlined",
                                                "form": { "section_id": "section-brand" }
                                            },
                                          },
                                          // Product colors [form_section] && [form_datatable]
                                          {
                                            "id": "section-color",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": {
                                                "label": "Product colors",
                                                "l": [],
                                                "theme": "light"
                                            }
                                          },
                                          {
                                            "id": "form_datatable-color",
                                            "type": "form_datatable",
                                            "slug": "form_datatable",
                                            "data": {
                                              "form": {"section_id": "section-color"},
                                              "columns": [
                                                  // {"field": "id", "header": "Id", "style": "width: 10%;"},
                                                  {"field": "name", "header": "Name", "style": "width: 20%;"},
                                                  {"field": "imageurl", "header": "Image url", "style": "width: 70%;"},
                                              ],
                                              "rows": [
                                                  // {"id": "1", "name": "Red", "imageurl": "https://via.placeholder.com/150"},
                                                  // {"id": "2", "name": "Blue", "imageurl": "https://via.placeholder.com/150"}
                                              ],
                                              "pt": { 
                                                  "table": {"style": "min-width: 50rem; table-layout:fixed"},
                                                  "column": {}
                                              },
                                              "addrow": true,
                                              "deleterow": true
                                            }
                                          },
                                          // Field: Product Details & Info
                                          {
                                            "id": "section-field",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": { "label": "Field", "l": [], "theme": "light" }
                                          },
                                          {
                                            "id": "form_datatable-field",
                                            "type": "form_datatable",
                                            "slug": "form_datatable",
                                            "data": {
                                              "form": { "section_id": "section-field" },
                                              "columns": [
                                                { "field": "name", "header": "Name", "style": "" },
                                                { "field": "value", "header": "Value", "style": "" },
                                                { "field": "typ", "header": "Type", "style": "" }
                                              ],
                                              "rows": [
                                                // { "name": "Product Details", "value": "<ul><li>Shirts for men</li><li>Ripple pattern</li><li>Drop Length length</li><li>U-Neck</li><li>Flannel fabric</li><li>Tailored Fit</li></ul>", "typ": "detail" },
                                                // { "name": "MATERIAL & CARE", "value": "Flannel<br>Gentle Cycle", "typ": "detail" },
                                                // { "name": "SIZE & FIT", "value": "Tailored Fit<br>The model (height 5'8\") is wearing a size 28", "typ": "detail" },
                                                // { "name": "Available Colors", "value": "Slate, Yellow", "typ": "detail" },
                                                // { "name": "Available Sizes", "value": "28, XS", "typ": "detail" },
                                                // { "name": "Fabrics", "value": "Flannel", "typ": "info" },
                                                // { "name": "Fit", "value": "Tailored Fit", "typ": "info" },
                                                // { "name": "Length", "value": "Drop Length", "typ": "info" },
                                                // { "name": "Neck", "value": "U-Neck", "typ": "info" },
                                                // { "name": "Occasions", "value": "Date Night", "typ": "info" },
                                                // { "name": "Patterns", "value": "Ripple", "typ": "info" },
                                                // { "name": "Wash Care", "value": "Gentle Cycle", "typ": "info" }
                                              ],
                                              "pt": { "table": { "style": "min-width: 50rem; table-layout:fixed" }, "column": {} },
                                              "addrow": true,
                                              "deleterow": true
                                            }
                                          },
                                          // Product seller [form_section] && [form_datatable]
                                          {
                                            "id": "section-seller",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": {
                                                "label": "Seller",
                                                "l": [],
                                                "theme": "light"
                                            }
                                          },
                                          {
                                            "id": "form_datatable-seller",
                                            "type": "form_datatable",
                                            "slug": "form_datatable",
                                            "data": {
                                              "form": {"section_id": "section-seller"},
                                              "columns": [
                                                  {"field": "name", "header": "Name", "style": ""},
                                                  {"field": "packer_info", "header": "Packer info", "style": ""},
                                                  {"field": "importer_info", "header": "Importer info", "style": ""},
                                                  {"field": "country_of_origin", "header": "Country of origin", "style": ""},
                                                  {"field": "manufacturer_info", "header": "Manufacturer info", "style": ""},
                                              ],
                                              "rows": [
                                                   {"name": "Enter name", "packer_info": "Enter packer info", "importer_info": "Enter importer info", "country_of_origin": "Enter country of origin", "manufacturer_info": "Enter manufacturer info"},
                                              ],
                                              "pt": { "table": {"style": "min-width: 50rem; table-layout:fixed"}, "column": {}},
                                              "addrow": false,
                                              "deleterow": false
                                            }
                                          },
                                          // Product Variant [form_section] && [form_datatable]
                                          {
                                            "id": "section-variant",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": { "label": "Product Variants", "l": [], "theme": "light" }
                                          },
                                          {
                                            "id": "form_datatable-variant",
                                            "type": "form_datatable",
                                            "slug": "form_datatable",
                                            "data": {
                                              "form": { "section_id": "section-variant" },
                                              "columns": [
                                                // { "field": "id", "header": "Id", "style": "width: 30%;" },
                                                { "field": "price", "header": "Price", "style": "" },
                                                { "field": "size_id", "header": "Size", "style": "" },
                                                { "field": "color_id", "header": "Color", "style": "" },
                                                { "field": "currency", "header": "Currency", "style": "" },
                                                { "field": "price_mrp", "header": "Price Mrp", "style": "" }
                                              ],
                                              "rows": [
                                              //   { "id": "34e1462e-bb56-45ad-a65c-a2380813faf2", "price": "347", "size_id": "28", "color_id": "Slate", "currency": "INR", "price_mrp": "903" },
                                              //   { "id": "da21b6db-7a06-4e86-a719-f6ef3b785846", "price": "347", "size_id": "28", "color_id": "Yellow", "currency": "INR", "price_mrp": "903" },
                                              //   { "id": "2e0f3c99-f6a8-49f1-8f93-1a8e779ba813", "price": "347", "size_id": "XS", "color_id": "Slate", "currency": "INR", "price_mrp": "903" },
                                              //   { "id": "7ffe2333-956c-428c-8693-8e4022d3f3c6", "price": "347", "size_id": "XS", "color_id": "Yellow", "currency": "INR", "price_mrp": "903" }
                                              ],
                                              "pt": { "table": { "style": "min-width: 50rem; table-layout:fixed" }, "column": {} },
                                              "addrow": true,
                                              "deleterow": true
                                            }
                                          },
                                          // Product Category [form_section] && [form_datatable]
                                          {
                                            "id": "section-category",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": { "label": "Product Categories", "l": [], "theme": "light" }
                                          },
                                          {
                                            "id": "form_datatable-category",
                                            "type": "form_datatable",
                                            "slug": "form_datatable",
                                            "data": {
                                              "form": { "section_id": "section-category" },
                                              "columns": [
                                                { "field": "name", "header": "Category Name", "style": "" }
                                              ],
                                              "rows": [
                                                // { "name": "Men" },
                                                // { "name": "Apparel" },
                                                // { "name": "Topwear" },
                                                // { "name": "Shirts" }
                                              ],
                                              "pt": { "table": { "style": "min-width: 50rem; table-layout:fixed" }, "column": {} },
                                              "addrow": true,
                                              "deleterow": true
                                            }
                                          },
                                          // Product Size Info [form_section] && [form_datatable]
                                          {
                                            "id": "section-size-info",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": { "label": "Size Information", "l": [], "theme": "light" }
                                          },
                                          {
                                            "id": "form_datatable-size-info",
                                            "type": "form_datatable",
                                            "slug": "form_datatable",
                                            "data": {
                                              "form": { "section_id": "section-size-info" },
                                              "columns": [
                                                { "field": "chart_url", "header": "Chart URL", "style": "" },
                                                { "field": "representation_url", "header": "Representation URL", "style": "" }
                                              ],
                                              "rows": [
                                                { "chart_url": "Enter Chart URL", "representation_url": "Enter Representation URL" }
                                              ],
                                              "pt": { "table": { "style": "min-width: 50rem; table-layout:fixed" }, "column": {} },
                                              "addrow": false,
                                              "deleterow": false
                                            }
                                          },
                                          // Hashtags [form_section] && [form_datatable]
                                          {
                                            "id": "section-hashtags",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": { "label": "Hashtags", "l": [], "theme": "light" }
                                          },
                                          {
                                            "id": "form_datatable-hashtags",
                                            "type": "form_datatable",
                                            "slug": "form_datatable",
                                            "data": {
                                              "form": { "section_id": "section-hashtags" },
                                              "columns": [
                                                { "field": "hashtag", "header": "Hashtag", "style": "" }
                                              ],
                                              "rows": [
                                                // { "hashtag": "#ootd" },
                                                // { "hashtag": "#fashion" },
                                                // { "hashtag": "#menswear" },
                                                // { "hashtag": "#menstyle" },
                                                // { "hashtag": "#shirts" },
                                                // { "hashtag": "#trendingnow" },
                                                // { "hashtag": "#onlineshopping" }
                                              ],
                                              "pt": { "table": { "style": "min-width: 50rem; table-layout:fixed" }, "column": {} },
                                              "addrow": true,
                                              "deleterow": true
                                            }
                                          },
                                          // Language [form_section] && [form_datatable]
                                          {
                                            "id": "section-lang",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": { "label": "Lang: 'en'", "l": [], "theme": "light" }
                                          },
                                          // Create Product [form_section] && [form_button]
                                          {
                                            "id": "section-create-product",
                                            "type": "form_section",
                                            "slug": "form_section",
                                            "data": { "label": "", "l": [], "theme": "light" }
                                          },
                                          {
                                            "id": "button-create-product",
                                            "type": "form_button",
                                            "slug": "form_button",
                                            "data": {
                                                "label": "Create Product",
                                                "size": "normal",
                                                "variant": "filled",
                                                "form": { "section_id": "section-create-product" },
                                            }
                                          }
                                    ]
                                }
                            }
                        }
                  },
                  // Toast
                  {
                    "id": "form_toast",
                    "type": "form_toast",
                    "slug": "form_toast",
                    "data": {
                        "env": "dev"
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
            ce_listen("child:msg" as any, async(_$: any) => {
                console.log(`[ce_listen]`,_$);

                syncState(_$);
                buildProduct();

                if (_$.type === "click" && _$._$p?.data?.curr?.id === "button-create-product") {
                   if (!isFormFilled()) return showToast("Please fill all required fields", "warn");

                   createProduct();
                   console.log("form completed")
                }        
            })
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
