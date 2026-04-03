import { ref, computed } from "vue"
import { useApi } from "./useApi"
import { useOrder } from "../contexts/useOrder"
import type { _$p_TYP, _p_TYP } from "../../../shared/types";
import { createTemplate } from "bind-str";
const { setOrder, currentOrder, clearOrder } = useOrder()
import { loadStripe } from "@stripe/stripe-js"

interface CartItem {pricing: any};

const items = ref<CartItem[]>([]);
const selectedCoupon = ref("");

// stripe vars
const payStripe = ref<Function | null>(null)


export const useCart =  (_v:{
  _ins:any,
  _p: _p_TYP,
  _$p: any,//_$p_TYP,
}) => {
  const _ins = _v._ins.value || _v._ins;
  const _$p = _v._$p.value || _v._$p;
  const { post, loading, error } = useApi();
  //console.log(_$p);
  
  const _tTok = createTemplate(_$p.data.curr.data.api.token,{open:"<",close:">"});
  const _token = _tTok({
    localStorage:{
      token:<any>localStorage.getItem("token"),
    }
  });
  //alert(_token);
  const url: any = _$p.data.curr.data.api.url;//'https://fastapi.dryutil.1mn.io/client/api/i/ona/order_management'
  const token: any = _token;//_$p.data.curr.data.api.token;//'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwZTNlMDRiLTVkNDAtNDg1ZS05OGU4LWEzOTI3NWU3MzM0OCIsInNlY3VyaXR5Ijp7InBhcnR5IjpbInBhcnhlOC1hMzkyNzVlNzMzNDgiLCJpYXQiOjE3NjU4MTI4Mjh9.OoClnPtlxI71L-e555nbNSmenmGufxewp78SlmdZCNxeuauXao5RRvqwOKQ77SJFqJXk0ng6GZ7VOgYECdEf-3k1UGX7w1NE_D5A6SP3UkVsSG8orYACFuvTyesbFwkpnEhdu0PBd6n8wuLkgU6nZ1bLDzKVg1zd8fFeJrwmUqk'
  const mode = _$p.data.curr.data.mode;
  const isLoggedin = token && token !== "Bearer null";

  const validateCoupon = async (code:any) => {
    const data = await post(url,{
      operation: "validate_coupon",
      user_id: "user_1",
      code
    },token)

    if (!data?.success) return error.value
  }

  const submit = async (coupon_code: any = selectedCoupon.value || "") => {
    let payload = null;

    if(mode === 'cart') {
       if(isLoggedin) {
          payload = { 
            operation: "get_cart",
            user_id: "user_1",
            address_id: _ins.var.payload.address.address_id,
            payment_method: "cod/online",
            payment_gateway: "stripe",
            page: 1,
            per_page: 20,
            coupon_code: coupon_code
          };
       } else {
          payload = {
            operation: "get_cart",
            delivery: { postalcode: "" },
            cart_items: JSON.parse(localStorage.getItem(_$p.data.curr.data.cart_itmes_key) || "[]"),
            coupon_code: coupon_code
          };
       }
    }

    if(mode === 'buy_now') {
       if(isLoggedin) {
         payload = {
          operation: "get_cart",
          user_id: "user_1",
          is_buy_now: true,
          address_id: _ins.var.payload.address.address_id,
          payment_method: "online",
          coupon_code: coupon_code
         }
       } else {
          payload = {
            operation: "get_cart",
            delivery: { postalcode: "" },
            cart_items: JSON.parse(localStorage.getItem(_$p.data.curr.data.buy_now_key) || "[]"),
            coupon_code: coupon_code
          };
       }
    }

    const data = await post(url, payload, token);
    if (!data?.success) return console.log("api error", data);
    items.value = data.items;
    
    //set if not loggedin put cart_items_id in localstorage api res
    // if (!isLoggedin) {
    //   const key = mode === 'cart' ? _$p.data.curr.data.cart_itmes_key : _$p.data.curr.data.buy_now_key;

    //   const _localStorageItems = JSON.parse(localStorage.getItem(key) || "[]")

    //   items.value = data.items.map((item:any) => {
    //     const cartItem = _localStorageItems.find((c:any) => c.variant_id === item.variant_id)
    //     return {...item, cart_item_id: cartItem?.cart_item_id}
    //   })
    // } else {
    //   items.value = data.items
    // }
  };

  // ======= Check box oprations ===========================================================================
  const selectedItems = computed(() => items.value.filter((i: any) => i.is_selected))
  const isAllSelected = computed(() => items.value.length > 0 && items.value.every((i:any) => i.is_selected))

  // 🔹 SELECT / UNSELECT
  const toggleSelect = async (is_selected: boolean , cart_item_id: any) => {
    if(!isLoggedin) return;

    const data = await post(url, 
      {
        "operation": "select_unselect_from_cart",
        "user_id": "user_1",
        "cart_item_id": cart_item_id,
        "is_selected": is_selected
      },token)

    if (!data?.success) return console.log("selected/unselected error", error.value)
    await submit();
  }
  
  // 🔹 MULTI SELECT / UNSELECT
  const toggleSelectAll = async (e:any) => {
    if(!isLoggedin) return;

    if (!items.value.length) return
    const checked = (e.target as HTMLInputElement).checked

    // collect ids
    const cart_item_ids = items.value.map((i:any) => i.cart_item_id)
    
    // Update ui state for each product
    items.value.forEach((i: any) => {
      i.is_selected = checked
    })
    
    const data = await post(url, 
      {
        "operation": "select_unselect_from_cart",
        "user_id": "user_1",
        "cart_item_ids": cart_item_ids,
        "is_selected": checked
      },token)

    if (!data?.success) return console.log("selected/unselected error", error.value)
    await submit();
  }

  // UPDATE QUANTITY FROM CART (only cart + login only)
  const quantityUpdate = async (cart_item_id: any, quantity: any) => {
    console.log("cart_item_id", cart_item_id)
    console.log("quantity", quantity)

    if(!isLoggedin) return;

    if(quantity > 3 || quantity < 1) return console.log('qauntity is limited cannot be more than 3'), null
    const data = await post(url, 
      {
        "operation": "update_cart_item",
        "user_id": "user_1",
        "cart_item_id": cart_item_id,
        "quantity": quantity,
      },token)

    if (!data?.success) return console.log("updating quantity error", error.value)
    await submit();
  }
  
  
  // Remove from cart (only cart + login only)
  const removeFromCart = async (cart_item_id: any) => {
    console.log("cart_item_id", cart_item_id)

    if(!isLoggedin) return;

    const data = await post(url, 
      {
        "operation": "remove_from_cart",
        "user_id": "user_1",
        "cart_item_id": cart_item_id
      },token)

    if (!data?.success) return console.log("remove from cart error", error.value)
    await submit();
  };

  const addToFavorites = async (product_id: any) => {
    console.log("product_id", product_id)

    if(!isLoggedin) return;

    const data = await post(url, 
      {
        "operation": "add_to_favorites",
        "user_id": "user_1",
        "product_id": product_id

      },token)

    if (!data?.success) return console.log("add to favorites error", error.value)
    console.log("added in fav:", data)
  };
 
  
  //set..
  const payNow = async (gateway: any) => {
    const data = await post(url, 
      {
        "operation": "create_payment",
        "user_id": "user_1",
        "order_id": currentOrder.value.order.order_id,
        "preferred_gateway": gateway,
        "email": "customer@example.com",
        "phone": "9991234567",
        "success_url": _$p.data.curr.data.event[`onPaymentSuccess`], //"https://fastapi.dryutil.1mn.io/client-public/api/i/ona/public:order_management?operation=tbank_callback",
        "fail_url": _$p.data.curr.data.event[`onPaymentFail`], //"https://fastapi.dryutil.1mn.io/client-public/api/i/ona/public:order_management?operation=tbank_callback"
      },token);

    if (!data?.success) return console.log("Pay now error", error.value)
    clearOrder()
    console.log('pay now success true: ',data)

    // TBANK
    if(gateway === "tbank") window.location.href = data?.payment_url;

    // RAZORPAY
    if (gateway === "razorpay") {
      const options = {
        key: data.pg_key_id,
        amount: data.amount * 100,
        currency: data.currency,
        order_id: data.pg_order_id,
        name: "1mn Store",
        description: data.order_number,

        handler: function (response:any) {
          console.log("payment success", response)
          window.location.href =
            _$p.data.curr.data.event[`onPaymentSuccess`]
        },

        prefill: {
          email: "customer@example.com", //set with user info. 
          contact: "8287386605" // change this too for otp on user mobile
        },
        theme: { color: "#3399cc" }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    }

    // STRIPE
    if (gateway === "stripe") {
      const stripe = await loadStripe(data.publishable_key)
      if (!stripe) return console.log("Stripe failed to load")

      const elements = stripe.elements()
      const card = elements.create("card")

      card.mount("#stripe-card-element")

      payStripe.value = async () => {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          data.client_secret,
          { payment_method: { card } }
        )

        if (error) {
          //window.location.href = _$p.data.curr.data.event.onPaymentFail
          console.log("Stripe payment error",error.message)
        }

        if (paymentIntent?.status === "succeeded") {
          window.location.href = _$p.data.curr.data.event.onPaymentSuccess
        }
      }
    }
  };

  // Procced to checkout
  const proceedToCheckout = async () => {
    console.log(_ins.var.step.curr_data);

    if (_ins.var.step.curr=="pick_items" || !_ins.var.payload.address.address_id) {
      _ins.var.btn.disable = true;
      _ins.fn.set_step({
        "name": "pick_address"
      });
      return;
    }
    //all ok..
    
    const _payload = {
        "operation": "create_order",
          //buy_now true
        "user_id": "user_1",
        "address_id": _ins.var.payload.address.address_id, //"6ed15bba-6e66-4bd7-bb98-e198c29cad24", //Mumbai
        "payment_method": "online",
        "preferred_gateway": _$p.data.curr.data.pg_provider,
        "coupon_code": ""
      };
    const data = await post(url, _payload, token)

    if (!data?.success) return console.log("Proceed to checkout error", error.value)
      

    //update..
    /*_ins.fn.set_step({
        "name": "place_order"
    });
    */
    setOrder(data);
    console.log('create order success true: ',data);
    //set..
    payNow(_payload.preferred_gateway);
  }

  // ======= Pricing oprations ====================================================== //
  const totalPrice = computed(() => selectedItems.value.reduce((sum, i:any) => sum + (i?.pricing.total_price || 0), 0))

  const totalPayable = computed(() => selectedItems.value.reduce((sum, i:any) => sum + (i?.pricing.total_payable_price || 0), 0))
  
  const discount = computed(() => (totalPrice.value - totalPayable.value).toFixed(2));

  const currency = computed(() => selectedItems.value[0]?.pricing.currency || "INR" )

  return { items, submit, loading, error, totalPrice, totalPayable, discount,  currency, toggleSelect, toggleSelectAll, selectedItems, isAllSelected, proceedToCheckout, payNow, quantityUpdate, removeFromCart, validateCoupon, selectedCoupon, addToFavorites, payStripe}
}
