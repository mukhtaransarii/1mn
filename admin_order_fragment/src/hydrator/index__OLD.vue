<template>
    <div v-if="_html">
        <div v-html="_html"></div>
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
const searchText = ref('Nike shirts'); // Reactive search text
const currentPage = ref(1); // Current page
const perPage = ref(20); // Items per page
const tableData:any = ref(null); // Store table data reference

// API Configuration
const API_CONFIG = {
    url: 'https://fastapi.dryutil.1mn.io/client/api/i/ona/product_dir?typ=get_product_list',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
};

// Function to fetch product list
async function fetchProductList(query: string, page: number = 1, per_page: number = 20) {
    try {
        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.token}`
            },
            body: JSON.stringify({
                q: query,
                page: page,
                per_page: per_page
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
function convertApiDataToRows(apiResponse: any) {
    if (!apiResponse || !apiResponse.success || !apiResponse.data || !apiResponse.data.products) {
        return [];
    }

    return apiResponse.data.products.map((item: any, index: number) => {
        const minPrice = Math.min(...item.variant_prices);
        const maxPrice = Math.max(...item.variant_prices);
        const priceDisplay = minPrice === maxPrice 
            ? `₹${minPrice}` 
            : `₹${minPrice} - ₹${maxPrice}`;

        return {
            id: item.id,
            sku: `SKU-${item.id.slice(0, 8)}`,
            name: `<a href="#" class="text-blue-600 hover:underline font-medium">${item.title}</a>`,
            brand: `<span class="font-semibold text-gray-700">${item.brand}</span>`,
            category: item.category.join(', '),
            price: priceDisplay,
            stock: item.variant_prices.length,
            rating: item._relevance_score ? (item._relevance_score * 5).toFixed(1) : "N/A",
            slug: `<span class="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold border border-transparent bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">${item.category[0] || 'Product'}</span>`
        };
    });
}

// Update table with new data
async function updateTableData(searchQuery: string, page: number = 1) {
    const apiResponse = await fetchProductList(searchQuery, page, perPage.value);
    
    if (apiResponse && apiResponse.success) {
        const newRows = convertApiDataToRows(apiResponse);
        
        if (tableData.value) {
            tableData.value.table.rows = newRows;
            
            // Update footer with pagination info
            const { found, total_pages, search_time_ms } = apiResponse.data;
            tableData.value.foo.txt = `Found ${found} products in ${search_time_ms}ms - Page ${page} of ${total_pages}`;

            //console.log(newRows);
            
            
            // Trigger update via content engine
            ce_call("msg", {
                type: `update_search`,
                _p: _p,
                _$p: _$p,
                custom: { 
                    searchText: searchQuery,
                    page: page,
                    totalPages: total_pages,
                    found: found
                },
                where: {
                    key: `id`,
                    value: `3e1bc78c-104f-4f6f-aa87-75`,
                }
            });
        }
    }
}

// Watch for search text changes with debounce
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
});

(async () => {
    //==test==//  [START]
    _p.my[`emitter`] = _p.f.new_emitter();
    _p.my[`emitter`].on("msg", async (_$:any) => {
        console.log(`_p.my.emitter.on`, _$);
    });
    await _p.my[`emitter`].emit("msg", {
        type: `on:change`,
        _p: _p,
        _$p: _$p,
    });

    _p.f.listen("msg", async (_$) => {
        console.log(`_p.f.listen`, _$);
        
        // Listen for search input changes
        if (_$.type === 'search_input' && _$.value) {
            searchText.value = _$.value;
        }
        
        // Listen for pagination
        if (_$.type === 'page_change' && _$.page) {
            currentPage.value = _$.page;
        }
    });
    
    setTimeout(async () => {
        await _p.f.call("msg", {
            type: `on:change`,
            _p: _p,
            _$p: _$p,
        });
    }, 500);
    //==test==//  [END]
})();

onMounted(() => {
    (async () => {
        let _css_server = ``;
        let _css_client = ``;
        let _editor_html = ``;
        let _editor_css_client = ``;
        
        // Fetch initial data from API
        const apiResponse = await fetchProductList(searchText.value, currentPage.value, perPage.value);
        const apiRows = convertApiDataToRows(apiResponse);

        let _data = {
            l: [
                {
                    "id": "3e1bc78c-104f-4f6f-aa87-75",
                    "type": "table",
                    "slug": "table",
                    "data": {
                        "theme": "light",
                        "foo": {
                            "txt": apiResponse?.success 
                                ? `Found ${apiResponse.data.found} products in ${apiResponse.data.search_time_ms}ms - Page ${apiResponse.data.page} of ${apiResponse.data.total_pages}`
                                : "Product Directory - Search for products"
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
                                    "title": "Product ID",
                                    "field": "id",
                                    "width": 150,
                                    "headerSort": false
                                },
                                {
                                    "title": "Product Name",
                                    "field": "name",
                                    "widthGrow": 3,
                                    "minWidth": 250,
                                    "formatter": "html"
                                },
                                {
                                    "title": "Brand",
                                    "field": "brand",
                                    "widthGrow": 1,
                                    "minWidth": 120,
                                    "formatter": "html"
                                },
                                {
                                    "title": "Category",
                                    "field": "category",
                                    "widthGrow": 1,
                                    "minWidth": 150
                                },
                                {
                                    "title": "Price",
                                    "field": "price",
                                    "width": 140,
                                    "hozAlign": "right"
                                },
                                // {
                                //     "title": "Variants",
                                //     "field": "stock",
                                //     "width": 80,
                                //     "hozAlign": "center"
                                // },
                                // {
                                //     "title": "Score",
                                //     "field": "rating",
                                //     "width": 80,
                                //     "hozAlign": "center"
                                // },
                                {
                                    "title": "Type",
                                    "field": "slug",
                                    "formatter": "html",
                                    "widthGrow": 1,
                                    "minWidth": 110,
                                    "hozAlign": "center"
                                }
                            ],
                            "rows": apiRows
                        }
                    }
                }
            ]
        };

        // Store reference to table data
        tableData.value = _data.l[0].data;

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

        (async()=>{
            ce_listen("msg", async(_$)=>{
                console.log(`[ce_listen]`,_$);
                
                if (_$.type==`load_more` && _$._$p.data.curr.id==`3e1bc78c-104f-4f6f-aa87-75`) {
                    currentPage.value += 1;
                }
                
                // Listen for search input from the UI
                if (_$.type === 'search_change') {
                    searchText.value = _$.searchValue || '';
                }
            });
        })();

        const _run = async () => {
            const _ce_renderer_rsp = await _ce_renderer.set({
                data:_data
            });

            _html.value = _ce_renderer_rsp.r || "";
            _css_server = _ce_renderer_rsp.style;

            const mS = document.createElement('style');
            document.head.appendChild(mS);
            mS.innerHTML = _css_server;

            setTimeout(async() => {
                const _ce_hydrator_rsp = await _ce_hydrator.set({
                    data:_data
                });
                console.log(_ce_hydrator_rsp);
            }, 200);
        }

        await _run();
    })();
})

</script>