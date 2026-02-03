import { ref, reactive } from "vue"
import { useApi } from "./useApi"

const addresses = ref<any>([]);
const selectedAddress = ref(null);
const showForm = ref(false);
const formMode = ref('create');  //create, update

const form: any = reactive({
  name: '',
  phone_number: '',
  street: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  address_type: '',
})



export const useAddress = () => {
  const { post, loading, error } = useApi()

  const url: any = 'https://fastapi.dryutil.1mn.io/client/api/i/ona/order_management'
  const token: any = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
  
  const getAddress = async () => {
    const data = await post(url,
      {
        "operation": "get_address",
        "user_id": "user_1",
        "page": 1,
        "limit": 100,
        "search": ""
      },token)

    if (!data?.success) return console.log("api error", error.value)
    addresses.value = data.data.slice().reverse();
  }
  
  const createAddress = async () => {
    console.log('create address run', form);
   
    const data = await post(url,
      {
        "operation": "add_address",
        "user_id": "user_1",
        "name": form.name,
        "phone_number": form.phone_number,
        "street": form.street,
        "city": form.city,
        "state": form.state,
        "pincode": form.pincode,
        "landmark": form.landmark,
        "address_type": form.address_type,
        "country_code": "IN",
        "is_default": true
      },token)

    if (!data?.success) return console.log("api error", error.value)
    await getAddress();
    
    selectedAddress.value = null
    showForm.value = false
    Object.keys(form).forEach(k => form[k] = '')
  }
  
 const updateAddress = async (address_id: string) => {
    const cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== '' && v !== null)
    )

    const data = await post(url, {
      operation: "update_address",
      user_id: "user_1",
      address_id,
      ...cleanedForm
    }, token)

    if (!data?.success) return console.log("api error", error.value)
    await getAddress();
    
    selectedAddress.value = null
    showForm.value = false
    Object.keys(form).forEach(k => form[k] = '')
  }


  const removeAddress = async (address_id:any) => {
    const data = await post(url,
      {
        "operation": "remove_address",
        "user_id": "user_1",
        "address_id": address_id,
      },token)

    if (!data?.success) return console.log("api error", error.value)
    await getAddress();
  }
  
  return {  addresses, getAddress, createAddress, updateAddress, removeAddress, selectedAddress, showForm, formMode,form }
} 

 