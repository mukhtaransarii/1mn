<template>
    <div class="bg-white p-3 sticky top-0 z-10 flex items-center gap-4" v-if="_var.html.search_panel && _var.html.create_refund && _var.html.process_refund">
      <div class="w-1/3" v-html="_var.html.search_panel"></div>
      <div v-html="_var.html.create_refund"></div>
      <div v-html="_var.html.process_refund"></div>
      <div v-html="_var.html.create_shipment"></div>
      <div v-html="_var.html.create_return"></div>
    </div>
    
    <div  v-if="_var.html.table">
        <div v-html="_var.html.table"></div>
    </div>
    
    <div v-if="_var.html.dialog">
        <div v-html="_var.html.dialog"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, reactive } from 'vue'
import type { _p_TYP, _$p_TYP } from "../shared/types";
import { ce_renderer, ce_hydrator, ce_listen, ce_call } from "content-engine-lib";

const {_p,_$p} = defineProps<{
    _p:_p_TYP,
    _$p:_$p_TYP,
}>();

const _html : any = ref(null);
const searchText = ref(''); //ref('Nike shirts'); // Reactive search text
const currentPage = ref(0); //ref(1); // Current page
const perPage = ref(20); // Items per page
//const tableData:any = ref(null); // Store table data reference

//set..
const _var = ref({
    html:{
        table:null,
        search_panel:null,
        create_refund: null,
        process_refund: null,
        create_shipment: null,
        create_return: null,
        dialog:null
    }
});

const payload: any = reactive({
  operation: "update_order_item",
  order_item_ids: [],
  order_status: "",
  return_status: "",
  delivery_provider: "",
  delivery_desc: "",
  return_desc: "",
  exclude_key: ["user_id"]
});

function isFormFilled() {
  return (
    payload.order_status &&
    payload.return_status &&
    payload.delivery_provider &&
    payload.delivery_desc &&
    payload.return_desc
  );
}

const buildProduct = (_$: any) => {
    const curr = _$._$p?.data?.curr;
    const type = curr?.data?.type;

    console.log("curr", curr)
    console.log("type", type)
}



// API Configuration
const API_CONFIG = {
    url: 'https://fastapi.dryutil.1mn.io/client/api/i/ona/order_management',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
};

// Function to fetch product list
async function fetchList(query: string, page: number = 1, per_page: number = 20) {
    try {
        //console.log(query);
        
        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.token}`
            },
            body: JSON.stringify({
               /* q: query,
                page: page,
                per_page: per_page*/
                //set..
                "operation": "get_orders",
                "user_id": "user_1",
                //"status": "pending",
                "search": query,//"wireless",
                "page": page,
                "limit": per_page,
                //set..
                "exclude_key": ["user_id"]
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

// Create Refund API
async function createRefund() {
  try {
    const res = await fetch(API_CONFIG.url,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_CONFIG.token}`
        },
        body: JSON.stringify({ operation: "create_refund" })
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Refund API Error:", err);
  }
}

// Process Refund
async function processRefund() {
  try {
    const res = await fetch(API_CONFIG.url,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_CONFIG.token}`
        },
        body: JSON.stringify({ operation: "processed_refund" })
      }
    );

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Processed Refund Error:", err);
  }
}

// create Delivery Shipment
async function createDeliveryShipment() {
  try {
    const response = await fetch(API_CONFIG.url,
       {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.token}`
        },
        body: JSON.stringify({
          operation: "create_delivery_shipment",
          item_limit: 10,
          condition: "",
          delivery_provider: "fedex"
        })
      }
    );

    const data = await response.json();
    console.log("Shipment Response:", data);

    if (data.success) {
      //showToast("success", data.message || "Shipment created successfully");
      alert(data.message || "Shipment created successfully");

      if (data.details?.created?.length) {
        console.log("Created Shipments:", data.details.created);
      }

      if (data.details?.failed?.length) {
        console.log("Failed Shipments:", data.details.failed);
      }
    } else {
      //showToast("error", data.message || "Shipment creation failed");
      alert(data.message || "Shipment creation failed");
    }

    return data;
  } catch (error) {
    console.error("Shipment API Error:", error);
    //showToast("Something went wrong", "error");
    alert("Something went wrong");
    return null;
  }
}

// create return shipment
async function createReturnShipment() {
  try {
    const response = await fetch(API_CONFIG.url,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.token}`
        },
        body: JSON.stringify({
          operation: "create_return_shipment",
          item_limit: 10,
          condition: "",
          delivery_provider: "fedex"
        })
      }
    );

    const data = await response.json();

    console.log("Return Shipment Response:", data);

    return data;
  } catch (error) {
    console.error("Return Shipment Error:", error);
    return null;
  }
}

// upadte order item.
async function updateOrderItem(payload: any) {
  try {
    const response = await fetch(API_CONFIG.url,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.token}`
        },
        body: JSON.stringify(payload)
      }
    );
    const data = await response.json();
    console.log("Update Order Item Response:", data);
    return data;
  } catch (error) {
    console.error("Update Order Item Error:", error);
    return null;
  }
}












// Convert API response to table rows
function convertApiDataToRows(apiResponse: any) {
    if (!apiResponse?.success || !Array.isArray(apiResponse.orders)) {
        return [];
    }

    //console.log(apiResponse.orders);
    

    return apiResponse.orders.map((order: any) => {
        const pricing = order.pricing || {};
        const address = order.shipping_address || {};

        return {
            // ===== Parent (Order) =====
            id: `ORDER-${order.order_id}`,
            type: "order",
            order_id: order.order_id,
            order_number: order.order_number,
            customer: address.name,
            phone: address.phone_number,
            city: address.city,
            total_items: order.items?.length || 0,
            total_price: `₹${pricing.total_price}`,
            tax: `₹${pricing.tax_amount}`,
            final_amount: `₹${pricing.final_amount}`,
            currency: pricing.currency,
            status: '-',//order.items?.[0]?.order_status ?? "N/A",

            // ===== Children (Order Items) =====
            _children: (order.items || []).map((item: any) => {
                const product = item.reference_data?.product_data || {};
                const variant = item.reference_data?.variant_product_data || {};

                return {
                    id: `ITEM-${item.order_item_id}`,
                    type: "item",
                    order_item_id: item.order_item_id,
                    product_id: product.id,
                    name: product.title,
                    /*brand: product.brand,
                    category: Array.isArray(product.category)
                        ? product.category.join(", ")
                        : "",*/

                    size: variant.size,
                    color: variant.color,
                    price: `₹${item.price}`,
                    payable_price: `₹${item.payable_price}`,
                    mrp: variant.mrp ? `₹${variant.mrp}` : "N/A",
                    stock: variant.stock,
                    status: item.order_status,
                    created_at: item.created_at,
                };
            }),
        };
    });
}

// Update table with new data
async function updateTableData(_$:any, searchQuery: string, page: number = 1) {
    const apiResponse = await fetchList(searchQuery, page, perPage.value);
    //console.log(apiResponse);

    
    if (apiResponse && apiResponse.success) {
        const newRows = convertApiDataToRows(apiResponse);

        //console.log(newRows);
        

        try {
        if (newRows.length>0) {}else{ throw new Error("no more data..");}
        } catch (err) { 
        console.log(err);
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
                                {
                                    title: "Order / Item",
                                    field: "order_number",
                                    width: 260,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();

                                        if (data.type === "order") {
                                            return `
                                                <div class="font-semibold text-gray-800">
                                                    ${data.order_number}
                                                </div>
                                                <div class="text-xs text-gray-500">
                                                    ${data.customer} • ${data.city}
                                                </div>
                                                `;
                                        }

                                        return `
                                            <div class="pl-6 text-sm text-gray-700">
                                            ${data.name}
                                            </div>
                                        `;
                                    }
                                },

                                /*{
                                    title: "Brand / Size",
                                    field: "brand",
                                    //width: 160,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();

                                        if (data.type === "order") {
                                            return `<span class="text-gray-400">—</span>`;
                                        }

                                        return `
                                        <div class="text-sm">
                                        <div class="font-medium">${data.brand}</div>
                                        <div class="text-xs text-gray-500">Size: ${data.size}</div>
                                        </div>
                                    `;
                                    }
                                },

                                {
                                    title: "Category",
                                    field: "category",
                                    //width: 200,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();
                                        return data.type === "order" ? "—" : data.category;
                                    }
                                },*/

                                {
                                    title: "Price",
                                    field: "price",
                                    hozAlign: "right",
                                    //width: 110,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();
                                        return data.type === "order" ? "—" : data.price;
                                    }
                                },

                                {
                                    title: "Payable",
                                    field: "payable_price",
                                    hozAlign: "right",
                                    //width: 110,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();
                                        return data.type === "order" ? "—" : data.payable_price;
                                    }
                                },

                                {
                                    title: "Qty / Items",
                                    field: "total_items",
                                    hozAlign: "center",
                                    //width: 120,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();

                                        if (data.type === "order") {
                                            return `<span class="font-semibold">${data.total_items}</span>`;
                                        }

                                        return "1";
                                    }
                                },

                                {
                                    title: "Status",
                                    field: "status",
                                    //width: 120,
                                    formatter: (cell: any) => {
                                        const status = cell.getValue();
                                        const data = cell.getRow().getData();

                                        const colors: any = {
                                            pending: "bg-yellow-100 text-yellow-700",
                                            shipped: "bg-blue-100 text-blue-700",
                                            delivered: "bg-green-100 text-green-700",
                                            cancelled: "bg-red-100 text-red-700",
                                        };

                                        return `
                                            <span class="px-2 py-1 rounded text-xs font-semibold
                                            ${colors[status] || "bg-gray-100 text-gray-600"}">
                                            ${status}
                                            </span>
                                        `;
                                    }
                                },

                                {
                                    title: "Final Amount",
                                    field: "final_amount",
                                    hozAlign: "right",
                                    //width: 140,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();
                                        return data.type === "order" ? data.final_amount : "—";
                                    }
                                },

                                {
                                    title: "Created",
                                    field: "created_at",
                                    //width: 170,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();
                                        return data.type === "order"
                                            ? `<span class="text-gray-600">—</span>`
                                            : `<span class="text-xs text-gray-500">${data.created_at}</span>`;
                                    }
                                },
                                {
                                    title: "Action",
                                    field: "action",
                                    //width: 170,
                                    formatter: (cell: any) => {
                                        const data = cell.getRow().getData();
                                        return data.type === "order"
                                            ? `<span class="text-gray-600">—</span>`
                                            : `<button class="delete-btn px-2 py-1 rounded bg-green-100 text-green-700 ">Edit</button>`;
                                    }
                                }

                            ],
                            "rows": [],//apiRows
                            //set..
                            //rowHeight: 175,
                            dataTree: true,
                            dataTreeChildField: "_children",
                            //set..
                            layout:"fitColumns",
                            resizableColumnFit:true,
                            dataTreeStartExpanded: true,


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
                // dailog
                {
                    "id": "dialog-edit",
                    "type": "dialog",
                    "slug": "dialog",
                    "data": {
                    "label": "Dialog",
                    "visible": false,
                    "modal": true,
                    "style": "",
                    "class": "w-sm md:w-md",
                    "positive": {
                        "label": "Ok"
                    },
                    "negative": {
                        "label": "Cancel"
                    },
                    "content": {
                        "ce_file": {
                        "config": {
                            "lazy_lib": {
                            "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/renderer.es.js",
                            "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/hydrator.es.js",
                            "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app@latest/modules/{*}/dist/editor.es.js"
                            }
                        },
                        "data": {
                            "l": [
                            // Order Status
                            {
                              id: "section-order-status",
                              type: "form_section",
                              slug: "form_section",
                              data: {
                                label: "Order Status",
                                l: [],
                                theme: "light"
                              }
                            },
                            {
                              id: "input-order-status",
                              type: "form_autocomplete",
                              slug: "form_autocomplete",
                              data: {
                                data: "",
                                placeholder: "Select order status",
                                optionLabel: "title",
                                showClear: true,
                                dropdown: true,
                                value: null,
                                options: [
                                  { title: "Pending", id: "pending" },
                                  { title: "Processing", id: "processing" },
                                  { title: "Shipped", id: "shipped" },
                                  { title: "Delivered", id: "delivered" },
                                  { title: "Cancelled", id: "cancelled" }
                                ],
                                style: { width: "12rem" },
                                api: {},
                                form: { section_id: "section-order-status" }
                              }
                            },
                          
                            // Return Status
                            {
                              id: "section-return-status",
                              type: "form_section",
                              slug: "form_section",
                              data: {
                                label: "Return Status",
                                l: [],
                                theme: "light"
                              }
                            },
                            {
                              id: "input-return-status",
                              type: "form_autocomplete",
                              slug: "form_autocomplete",
                              data: {
                                data: "",
                                placeholder: "Select return status",
                                optionLabel: "title",
                                showClear: true,
                                dropdown: true,
                                value: null,
                                options: [
                                  { title: "Not Requested", id: "not_requested" },
                                  { title: "Requested", id: "requested" },
                                  { title: "Approved", id: "approved" },
                                  { title: "Rejected", id: "rejected" },
                                  { title: "Returned", id: "returned" }
                                ],
                                style: { width: "12rem" },
                                api: {},
                                form: { section_id: "section-return-status" }
                              }
                            },
                          
                            // Delivery Provider
                            {
                              id: "section-delivery-provider",
                              type: "form_section",
                              slug: "form_section",
                              data: {
                                label: "Delivery Provider",
                                l: [],
                                theme: "light"
                              }
                            },
                            {
                              id: "input-delivery-provider",
                              type: "form_autocomplete",
                              slug: "form_autocomplete",
                              data: {
                                data: "",
                                placeholder: "Select delivery provider",
                                optionLabel: "title",
                                showClear: true,
                                dropdown: true,
                                value: null,
                                options: [
                                  { title: "Delhivery", id: "delhivery" },
                                  { title: "Blue Dart", id: "bluedart" },
                                  { title: "DTDC", id: "dtdc" },
                                  { title: "Ekart", id: "ekart" },
                                  { title: "India Post", id: "indiapost" }
                                ],
                                style: { width: "12rem" },
                                api: {},
                                form: { section_id: "section-delivery-provider" }
                              }
                            },
                          
                            // Delivery Description (unchanged)
                            {
                              id: "section-delivery-description",
                              type: "form_section",
                              slug: "form_section",
                              data: {
                                label: "Delivery Description",
                                l: [],
                                theme: "light"
                              }
                            },
                            {
                              id: "input-delivery-description",
                              type: "form_inputtext",
                              slug: "form_inputtext",
                              data: {
                                value: "",
                                placeholder: "Enter delivery description",
                                style: { width: "12rem" },
                                variant: "outlined",
                                form: { section_id: "section-delivery-description" }
                              }
                            },
                          
                            // Return Description (unchanged)
                            {
                              id: "section-return-description",
                              type: "form_section",
                              slug: "form_section",
                              data: {
                                label: "Return Description",
                                l: [],
                                theme: "light"
                              }
                            },
                            {
                              id: "input-return-description",
                              type: "form_inputtext",
                              slug: "form_inputtext",
                              data: {
                                value: "",
                                placeholder: "Enter return description",
                                style: { width: "12rem" },
                                variant: "outlined",
                                form: { section_id: "section-return-description" }
                              }
                            }
                          ]
                         }
                        },
                        // "value": "<div>Hello world!</div>"
                    }
                    }
                },
                {
                  "id": "form_button-create-refund",
                  "type": "form_button",
                  "slug": "form_button",
                  "data": {
                      "label": "Create Refund",
                      "size": "small",
                      "variant": "filled",
                      "style": "background-color: black; border: 1px solid black"
                  }
                },
                {
                  "id": "form_button-process-refund",
                  "type": "form_button",
                  "slug": "form_button",
                  "data": {
                      "label": "Process Refund",
                      "size": "small",
                      "variant": "filled",
                      "style": "background-color: black; border: 1px solid black"
                  }
                },
                {
                  "id": "form_button-create-shipment",
                  "type": "form_button",
                  "slug": "form_button",
                  "data": {
                      "label": "Create Shipment",
                      "size": "small",
                      "variant": "filled",
                      // "style": "background-color: black; border: none"
                  }
                },
                {
                  "id": "form_button-create-return",
                  "type": "form_button",
                  "slug": "form_button",
                  "data": {
                      "label": "Create Return",
                      "size": "small",
                      "variant": "filled",
                      // "style": "background-color: black; border: none"
                  }
                },
                // Toast
                // {
                //   "id": "form_toast",
                //   "type": "form_toast",
                //   "slug": "form_toast",
                //   "data": {
                //       "env": "dev"
                //   }
                // }
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
                    searchText.value = _$._p[`query`];
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
                
                // Create Refund Call
                if (_$.type==`click` && _$._$p.data.curr.id==`form_button-create-refund`) {
                   const data = await createRefund();
                   alert(data?.message)
                }
                
                // Process Refund Call
                if (_$.type==`click` && _$._$p.data.curr.id==`form_button-process-refund`) {
                   const data = await processRefund();
                   alert(data?.message)
                }
                
                // Create shipment
                if (_$.type==`click` && _$._$p.data.curr.id==`form_button-create-shipment`) {
                   const data = await createDeliveryShipment();
                   alert(data?.message)
                }
                
                // Create return shipmenr
                if (_$.type==`click` && _$._$p.data.curr.id==`form_button-create-return`) {
                   const data = await createReturnShipment();
                   alert(data?.message)
                }
                
                // build payload
                if(_$.type === "autocomplete:select" || _$.type === "inputText:value" ) {
                  buildProduct(_$);
                  console.log("buil payload")
                }

                // Update Order Item
                if (_$.type === "btn:positive" && _$._$p?.data?.curr?.id === "dialog-edit") {
                  if (!isFormFilled()) return alert("Please fill all required fields");
                  
                  await updateOrderItem(payload);
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
            _var.value.html.create_refund = _ce_renderer_rsp.r[3] || "";
            _var.value.html.process_refund = _ce_renderer_rsp.r[4] || "";
            _var.value.html.create_shipment = _ce_renderer_rsp.r[5] || "";
            _var.value.html.create_return = _ce_renderer_rsp.r[6] || "";

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
        document.addEventListener('click', async (e: any) => {
          const btn = e.target.closest('.delete-btn');
          if (!btn) return;
          
          ce_call('msg', {
            type: 'open',
            custom: {},
            _$p: {},
            _p: {},
            where: { key: 'id', value: 'dialog-edit' }
          });
          
          // hydrate to show ce file in dailog
          await _ce_hydrator.set({
            data: { l: [_data.l.find(x => x.id === 'dialog-edit')]}
          });


        });
    })();
});

</script>