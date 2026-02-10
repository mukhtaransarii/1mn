import { ref, reactive } from "vue"
import { useApi } from "./useApi"

const bankAccounts = ref<any>([])
const selectedBank = ref(null)
const showForm = ref(false)
const formMode = ref('create') // create, update

const form: any = reactive({
  holder_name: '',
  ifsc_code: '',
  account_number: '',
  upi_id: '',
  country: '',
})

export const useBank = () => {
  const { post, loading, error } = useApi()

  const url: any = 'https://fastapi.dryutil.1mn.io/client/api/i/ona/order_management';
  const token: any = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYXJ0eV8yIl19LCJzdWIiOiJmMGUzZTA0Yi01ZDQwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk';

  const getBanks = async () => {
    const data = await post(url, {
      operation: "get_bank_accounts",
      user_id: "user_1",
      page: 1,
      limit: 10
    }, token)

    if (!data?.success) return console.log("api error", error.value)
    bankAccounts.value = data.bank_accounts.slice().reverse()
  }

  const createBank = async () => {
    const data = await post(url, {
      operation: "add_bank_account",
      user_id: "user_1",
      ...form
    }, token)

    if (!data?.success) return console.log("api error", error.value)
    await getBanks()
    selectedBank.value = null
    showForm.value = false
    Object.keys(form).forEach(k => form[k] = '')
  }

  const updateBank = async (account_id: string) => {
    const cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== '' && v !== null)
    )

    const data = await post(url, {
      operation: "update_bank_account",
      user_id: "user_1",
      account_id,
      ...cleanedForm
    }, token)

    if (!data?.success) return console.log("api error", error.value)
    await getBanks()
    selectedBank.value = null
    showForm.value = false
    Object.keys(form).forEach(k => form[k] = '')
  }

  const removeBank = async (account_id: any) => {
    const data = await post(url, {
      operation: "delete_bank_account",
      user_id: "user_1",
      account_id
    }, token)

    if (!data?.success) return console.log("api error", error.value)
    await getBanks()
  }

  return {
    bankAccounts,
    getBanks,
    createBank,
    updateBank,
    removeBank,
    selectedBank,
    showForm,
    formMode,
    form
  }
}
