import { ref, computed, watch } from "vue"
import { useApi } from "./useApi"
import type { _$p_TYP } from "../../../shared/types"
import { useVar } from "./useVar";
import { createTemplate } from "bind-str";


const order = ref([]);
const deliveredOrder = ref([]);
const payment_status = ref(null);

// enum: ORDER_PAGE, PURCHASED_PAGE
const page_state = ref(localStorage.getItem('page_state') || 'ORDER_PAGE');
watch(page_state, val => localStorage.setItem('page_state', val));

//set..
export const useOrder = (/*_v?:{
  _$p:_$p_TYP
}*/) => {
  const {_$p} = useVar();
  //alert(_$p.value?.data.curr.data.api[`token`]);

  //const _$p = _v?._$p;
  const { post, loading, error } = useApi();

  //alert(_$p.value?.data)
  const _t_temp = createTemplate(_$p.value?.data.curr.data.api[`token`],{open:"<",close:">"});
  const _token = _t_temp({
    localStorage:{
      token:localStorage.getItem(`token`) || ``
    }
  }).replace(`Bearer `,``);
  const url: any = _$p.value?.data.curr.data.api[`url`];// 'https://fastapi.dryutil.1mn.io/client/api/i/ona/order_management';
  const token: any = _token;//'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnR5XzEiLCJwYwLTQ4NWUtOThlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
  //alert(token);

  const getAllOrder = async () => {
    const data = await post(url,
      {
        "operation": "get_orders",
        "user_id": "user_1",
        "search": "",
        "page": 1,
        "limit": 10,
      },token)

    if (!data?.success) return console.log("api error", error.value)
    order.value = data.orders
  }
  
   const getPaymentStatus = async (order_id:any) => {

    const data = await post(url,
      {
        "operation": "check_payment_status",
        "user_id": "user_1",
        "order_id": order_id
      },token)
    
    payment_status.value = data?.success ? data.payment_status : 'not paid';
  }

  const returnRequest = async (order_id:any, order_item_id:any, return_reason:string, return_desc:string) => {

    // console.log(order_id);
    // console.log(order_item_id);
    // console.log(return_reason);
    // console.log("return des: ",return_desc);
  
    const data = await post(url,
      {   
        "operation": "create_return",
        "order_id": order_id,
        "order_item_id": order_item_id,
        "return_reason": return_reason,
        "return_desc": '' // hardcoded empty from user side
      },token)
    
      if(!data.success) return console.log("api error", error.value)
      console.log("return req api response",data);
      getDeliveredOrder();
      getAllOrder();
  }

  const getDeliveredOrder = async () => {
    const data = await post(url,
      {
        "operation": "get_orders",
        "user_id": "user_1",
        "status": "delivered",
        "search": "",
        //"exclude_key": ["user_id"],
        "page": 1,
        "limit": 10
      },token)

    if (!data?.success) return console.log("api error", error.value)
    deliveredOrder.value = data.orders;
  }

  const createReviewAndRating = async (order_item_id:number, rating:number, review_text:string) => {
    // console.log("order_item_id", order_item_id)
    // console.log("rating", rating)
    // console.log("review_text", review_text)

    const data = await post(url,
      {
        "operation": "create_review",
        "order_item_id": order_item_id,
        "rating": rating,
        "review_text": review_text
      },token)

    if (!data?.success) return console.log("api error", error.value)
    console.log(data);
    getDeliveredOrder();
    getAllOrder();
  }

  const updateReviewAndRating = async (review_id:any, rating:number, review_text:string) => {
    // console.log("review_id", review_id)
    // console.log("rating", rating)
    // console.log("review_text", review_text)

    const data = await post(url,
      {
        "operation": "update_review",
        "review_id": review_id,
        "rating": rating,
        "review_text": review_text
      },token)

    if (!data?.success) return console.log("api error", error.value)
    console.log(data);
    getDeliveredOrder();
    getAllOrder();
  }

  return { getAllOrder, order, getPaymentStatus, payment_status, page_state, returnRequest, getDeliveredOrder, deliveredOrder, createReviewAndRating, updateReviewAndRating }
} 
