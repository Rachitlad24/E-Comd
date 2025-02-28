import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useLocation } from "react-router-dom";


function PaypalReturnPage(){
const dispatch = useDispatch();
const location = useLocation();
const params = new URLSearchParams(location.search);
const paymentId = params.get('paymentId')|| "null";
const payerId = params.get('PayerID') || "null";
const {user}=useSelector(state=>state.auth)

useEffect(()=>{

    if(paymentId && payerId){
      const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
      dispatch(capturePayment({ paymentId, payerId, orderId})).then((data=>{
        if(data?.payload?.success){
           sessionStorage.removeItem('currentOrderId')
           localStorage.setItem('orderId',orderId)
           window.location.href = '/shop/payment-success'
        }
      }))
    }


},[paymentId,payerId,dispatch])

    return(
      <Card>
      <CardHeader>
        <CardTitle>
          Processing Payment...Please Wait
        </CardTitle>
        </CardHeader>  
      </Card>
    );
}

export default PaypalReturnPage;