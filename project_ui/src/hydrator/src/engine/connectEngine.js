import { reactive } from "vue";

export const engine = reactive({
  availableModules: [
    {
      id: "carousel",
      label: "Carousel",
      type: "carousel",
      ce_file:
        "https://raw.githubusercontent.com/1mn-io/mn-app/refs/heads/main/modules/carousel/dist/data.json"
    },
    {
      id: "collage",
      label: "Collage",
      type: "collage",
      ce_file:
        "https://raw.githubusercontent.com/1mn-io/mn-app/refs/heads/main/modules/collage/dist/data.json"
    },
    {
      id: "cart_popup",
      label: "Cart Popup",
      type: "cart_popup",
      ce_file:
        "https://raw.githubusercontent.com/1mn-io/mn-app/refs/heads/main/modules/cart_popup/dist/data.json"
    },
    {
      id: "admin_coupon_upsert",
      label: "Admin Coupon Upsert",
      type: "admin_coupon_upsert",
      ce_file:
        "https://raw.githubusercontent.com/1mn-io/mn-app/refs/heads/main/modules/admin_coupon_upsert/dist/data.json"
    },
    {
      id: "product_fav",
      label: "Product Favorite",
      type: "product_fav",
      ce_file: "https://raw.githubusercontent.com/1mn-io/mn-app/refs/heads/main/modules/product_fav/dist/data.json"
    }
  ],

  canvasModules: [
  //   {
  //   "uid": "c2a0d16a-adea-425a-98fb-154ace148205",
  //   "type": "carousel",
  //   "slug": "carousel",
  //   "ce_file": "https://raw.githubusercontent.com/1mn-io/mn-app/refs/heads/main/modules/carousel/dist/data.json",
  //   "ce_config": {
  //       "lazy_lib": {
  //           "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/renderer.es.js",
  //           "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/hydrator.es.js",
  //           "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/editor.es.js"
  //       }
  //   },
  //   "ce_data": [
  //       {
  //           "id": "c2a0d16a-adea-425a-98fb-154ace148205",
  //           "type": "carousel",
  //           "slug": "carousel",
  //           "data": {
  //               "data": "",
  //               "theme": "light",
  //               "foo": ""
  //           }
  //       }
  //   ],
  //   "minimized": false,
  //   "collapsed": false,
  //   "state": {
  //       "theme": "light",
  //       "env": "dev"
  //   },
  //   "_created": 1769414479018
  // }
],

  
  
  selectedId: null,
  dragOverIndex: null,
  fetchCache: {}, // Cache fetched CE data to avoid re-fetching

 async addToCanvas(module, targetIndex = null) {
    let rawJson = null;
    let _id = crypto.randomUUID();

    try {
      // 1. FETCH OR GET FROM CACHE
      // if (this.fetchCache[module.ce_file]) {
      //   rawJson = this.fetchCache[module.ce_file];
      // } else {
      //   const res = await fetch(module.ce_file);
      //   rawJson = await res.json();
      //   this.fetchCache[module.ce_file] = rawJson;
      // }
      
      // by MUKHTAR: support direct object too, not just URL, ce_file: "https://raw.githubusercontent.com/1mn-io/mn-app/refs/heads/main/modules/cart_popup/dist/data.json"
      if (typeof module.ce_file === "object") {
        rawJson = module.ce_file;
      } else {
        if (this.fetchCache[module.ce_file]) {
          rawJson = this.fetchCache[module.ce_file];
        } else {
          const res = await fetch(module.ce_file);
          rawJson = await res.json();
          this.fetchCache[module.ce_file] = rawJson;
        }
      }

      //log..
      //console.log(rawJson);

      //update..
      rawJson[`data`].l[0][`id`] = _id;
      //push in global data store if needed
      //globalDataStore.push(rawJson[`data`].l[0]);

      
    } catch (e) {
      console.error("CE fetch failed:", e);
      return;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // CRITICAL FIX START: DEEP CLONE EVERYTHING
    // ─────────────────────────────────────────────────────────────────────────────
    // We clone the ENTIRE fetched object before touching it.
    // This ensures 'config', 'data', and any nested objects are brand new copies.
    const deepClonedJson = JSON.parse(JSON.stringify(rawJson));

    const instance = {
      uid:  _id, //crypto.randomUUID(), // Unique ID for Vue 'key'
      type: module.type,
      slug: module.id,
      ce_file: module.ce_file,

      // USE THE CLONED DATA
      // Even if the original had "initialized: true" stuck to it from a previous
      // render, this clone is fresh (if the cache was clean) OR we rely on
      // the component to re-initialize because it's a new pointer.
      ce_config: deepClonedJson.config || {}, 
      ce_data: deepClonedJson.data?.l || [], 
      
      minimized: false,
      collapsed: false,
      state: {
        theme: "light",
        env: "dev"
      },
      _created: Date.now()
    };
    // ─────────────────────────────────────────────────────────────────────────────
    // CRITICAL FIX END
    // ─────────────────────────────────────────────────────────────────────────────

    // Insert logic (Same as before)
    if (targetIndex !== null && targetIndex >= 0 && targetIndex <= this.canvasModules.length) {
      this.canvasModules.splice(targetIndex, 0, instance);
    } else {
      this.canvasModules.push(instance);
    }

    this.select(instance.uid);
  },

  select(uid) {
    this.selectedId = uid;
  },

  update(uid, changes) {
    const mod = this.canvasModules.find(m => m.uid === uid);
    if (mod) {
      Object.assign(mod.state, changes);
    }
  },

  remove(uid) {
    const index = this.canvasModules.findIndex(m => m.uid === uid);
    if (index !== -1) {
      this.canvasModules.splice(index, 1);
     // console.log(`Module with UID ${uid} removed from canvas.`, this.canvasModules);

      if (this.selectedId === uid) {
        this.selectedId = null;
      }
    }
  },

  // Move module from one position to another
  moveModule(fromUid, toIndex) {
    const fromIndex = this.canvasModules.findIndex(m => m.uid === fromUid);
    if (fromIndex === -1 || toIndex < 0 || toIndex > this.canvasModules.length) return;

    const [movedModule] = this.canvasModules.splice(fromIndex, 1);
    
    // Adjust target index if moving down
    const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    this.canvasModules.splice(adjustedIndex, 0, movedModule);
  },

  // Get the drop index based on position
  getDropIndex(mouseY, canvasElement) {
    if (this.canvasModules.length === 0) return 0;

    const modules = Array.from(canvasElement.querySelectorAll('.ce-parent'));
    
    for (let i = 0; i < modules.length; i++) {
      const rect = modules[i].getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      
      if (mouseY < midpoint) {
        return i;
      }
    }
    
    return this.canvasModules.length;
  },

  setDragOverIndex(index) {
    this.dragOverIndex = index;
  },

  clearDragOverIndex() {
    this.dragOverIndex = null;
  },

  // Clear cache if needed
  clearCache() {
    this.fetchCache = {};
  },

  moveUp(uid) {
    const index = this.canvasModules.findIndex(m => m.uid === uid);
    if (index > 0) {
      const temp = this.canvasModules[index - 1];
      this.canvasModules[index - 1] = this.canvasModules[index];
      this.canvasModules[index] = temp;
    }
  },

  moveDown(uid) {
    const index = this.canvasModules.findIndex(m => m.uid === uid);
    if (index !== -1 && index < this.canvasModules.length - 1) {
      const temp = this.canvasModules[index + 1];
      this.canvasModules[index + 1] = this.canvasModules[index];
      this.canvasModules[index] = temp;
    }
  },

  toggleMinimize(uid) {
      const mod = this.canvasModules.find(m => m.uid === uid);
      if (mod) {
        mod.minimized = !mod.minimized;
        
        // If we are minimizing, deselect it so the border goes away
        if (mod.minimized && this.selectedId === uid) {
          this.selectedId = null;
        }
        // If we are restoring, select it immediately
        if (!mod.minimized) {
          this.select(uid);
        }
      }
  },

  formatBlock(_v = { ce_file: null, curr: null }) {
    let _i =   {
    "uid": _v.curr["id"], //c2a0d16a-adea-425a-98fb-154ace148205",
    "type": "carousel",
    "slug": "carousel",
    "ce_file":`https://raw.githubusercontent.com/1mn-io/mn-app/refs/heads/main/modules/${_v.ce_file.data.l[0].type}/dist/data.json`,
    "ce_config": {
        "lazy_lib": {
            "renderer_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/renderer.es.js",
            "hydrator_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/hydrator.es.js",
            "editor_src": "https://cdn.jsdelivr.net/gh/1mn-io/mn-app/modules/{*}/dist/editor.es.js"
        }
    },
    "ce_data": /*[
        {
            "id": "c2a0d16a-adea-425a-98fb-154ace148205",
            "type": "carousel",
            "slug": "carousel",
            "data": {
                "data": "",
                "theme": "light",
                "foo": ""
            }
        }
    ], */ [_v.curr],

    "minimized": false,
    "collapsed": false,
    "state": {
        "theme": "light",
        "env": "dev"
    },
    "_created": 1769414479018
  };
    return _i;
  }
});
