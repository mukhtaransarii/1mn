import { ref, reactive } from "vue"
import { useApi } from "./useApi"
import { createTemplate } from "bind-str"
import type { _$p_TYP } from "../../../shared/types"

const bankAccounts = ref<any>([])
const selectedBank:any = ref(null)
const showForm = ref(false)
const formMode = ref('create')

const form:any = reactive({
  holder_name: '',
  ifsc_code: '',
  account_number: '',
  upi_id: '',
  country: '',
})

export const useBank = () => {
  const { post, error } = useApi()

  const url:any = 'https://fastapi.dryutil.1mn.io/client/api/i/ona/order_management';
  const token:any = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk';

  const viewBank = async (account_id: string) => {
    const data = await post(url, {
      operation: "view_bank_account",
      user_id: "user_1",
      account_id
    }, token)

    return data?.bank_account || null
  }


  const createBank = async (_$p:_$p_TYP) => {
    const data = await post(url,{
      operation:"create_bank_account",
      user_id:"user_1",
      ...form
    },token)

    if (!data?.success) return console.log(error.value)

    try {
      const _t = createTemplate(_$p.data.curr.data.event[`onCreated`])
      location.href = _t({})
    } catch (err) {
      console.log(err)
    }
  }

  const updateBank = async (_$p:_$p_TYP, account_id:string) => {
    const cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([_,v])=>v)
    )

    const data = await post(url,{
      operation:"update_bank_account",
      user_id:"user_1",
      account_id,
      ...cleanedForm
    },token)

    if (!data?.success) return console.log(error.value)

    try {
      const _t = createTemplate(_$p.data.curr.data.event[`onUpdated`])
      location.href = _t({})
    } catch (err) {
      console.log(err)
    }
  }

  return {
    bankAccounts,
    selectedBank,
    showForm,
    formMode,
    form,
    createBank,
    updateBank,
    viewBank
  }
}
