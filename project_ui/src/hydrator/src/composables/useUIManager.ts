// composables/useUIManager.ts
import { ref } from "vue";
import { engine } from "../engine/connectEngine";
import { useApi } from "./useApi";

export const useUIManager = () => {
  const { post, loading, error } = useApi();

  // ───────────── GLOBAL API CONFIG ─────────────
  const url = "https://fastapi.dryutil.1mn.io/client/api/i/ona/ui_management";
  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk';
  // const uiId = ref<string | null>(null);

  // ─────────────── CREATE NEW UI ───────────────
  const createUI = async (_v: any) => {
    const payload = {
      parent_id: "",
      typ: _v.typ,
      name: _v.name,
      dta:  _v.dta // { ce_file: {} }
    };

    const data = await post(`${url}?typ=create_ui_info`, payload, token);
    
    if(!data.success) return console.error("Create UI failed:", data.message);
   
    engine.canvasModules = []; // start empty
  };

  // ─────────────── LIST UI INFO ───────────────
  const listUI = async () => {
    const data = await post(`${url}?typ=list_ui_info`,{ page: 1, page_size: 10 }, token);

    if (!data.success) return console.error("Load UI failed:", data.message);
   
    const apiModules = data.data.items.map((item: any) => {
      return {
        id: item.id,          
        label: item.name,    
        type: item.typ,       
        ce_file: item.dta?.ce_file || {} 
      };
    });

    //engine.availableModules = apiModules;
  };


  // ─────────────── GET UI ───────────────
  const getUI = async (id: any) => {
    
    const data = await post(`${url}?typ=get_ui_info`, { id }, token);
    if(!data?.success) return console.error("Get UI failed:", data?.message);

    return data?.data;
  };

  // ─────────────── DELETE UI ───────────────
  const deleteUI = async (id: any) => {
    const data = await post(`${url}?typ=delete_ui_info`, { id }, token);
    if(!data?.success) return console.error("Delete UI failed:", data.message);

    await listUI();
  };
  
  // ─────────────── SAVE / UPDATE UI ───────────────
  const updateUI = async (_v:any) => {

    const payload = {
      id: _v.id,
      parent_id: "",
      typ: _v.typ,
      name: _v.name,
      dta:  _v.dta // { ce_file: {} }
    };

    const data = await post(`${url}?typ=update_ui_info`, payload, token);
    if(!data.success) return console.error("Save UI failed:", data.message);
  };

  return { url, token, loading, error, createUI, listUI, getUI, updateUI, deleteUI };
};
