import axios from "axios"
import { ref } from "vue"

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const post = async (url: any, body: any, token: any = null) => {
    loading.value = true
    error.value = null

    try {
      const { data } = await axios.post(url, body, {
        headers: token
          ? { Authorization: `${token}`/*`Bearer ${token}`*/ }
          : {},
      })


      return data
    } catch (e: any) {
      error.value = e.response?.data?.message || "Error"
      return null
    } finally {
      loading.value = false
    }
  }

  return { post, loading, error }
}
