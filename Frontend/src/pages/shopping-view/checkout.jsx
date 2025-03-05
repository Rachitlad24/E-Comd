import Address from '@/components/shopping-view/address';
import img from '../../assets/account.jpg' 
import { useDispatch, useSelector } from 'react-redux';
import UserCartItemsContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { useToast } from '@/hooks/use-toast';
import { clearCart } from "@/store/shop/cart-slice/index";
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/shopping-view/footer';

function ShoppingCheckout(){

  const {cartItems} = useSelector(state=> state.shopCart);
  const {user} = useSelector((state)=>state.auth);
  const{orderItems} = useSelector(state=>state.shopOrder)
  const {approvalURL} = useSelector(state=>state.shopOrder)
  const [currentSelectedAddress,setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart,setIsPaymentStart] = useState(false)
  const dispatch = useDispatch();
  const {toast} = useToast();
  const[paymentMethod,setPaymentMethod]=useState("paypal")
  const navigate = useNavigate();

  useEffect(()=>{
    if(cartItems.length=== 0){
      setCurrentSelectedAddress(null);
    }
  },[cartItems])

  const totalCartAmount = cartItems && cartItems?.items && cartItems?.items?.length > 0 ? 
  cartItems?.items.reduce((sum,currentItem) => sum + (
    currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price

  ) * currentItem?.quantity, 0) 
  : 0 ;

function handleInitiatePaypalPayment(){
  if(!cartItems || cartItems?.items?.length === 0){
    toast({
      title : 'Your cart is empty. Please add items to proceed',
      variant : 'destructive'
    })
    return;
  
  }


if(currentSelectedAddress == null){
  toast({
    title : 'Please select one address to proceed.',
    variant : 'destructive'
  })
  return;

}

  const orderData={
  userId : user?.id,
  cartId : cartItems?._id,
  cartItems : cartItems?.items.map(singleCartItem =>({
    productId: singleCartItem?.productId,
      title: singleCartItem?.title,
      image: singleCartItem?.image,
      price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice :singleCartItem?.price,
      quantity: singleCartItem?.quantity,
  })),
  addressInfo : {
    addressId: currentSelectedAddress?._id,
    address:  currentSelectedAddress?.address,
    city:  currentSelectedAddress?.city,
    pincode:  currentSelectedAddress?.pincode,
    phone:  currentSelectedAddress?.phone,
    notes:  currentSelectedAddress?.notes,
  },
  orderStatus :'pending',
  paymentMethod,
  paymentStatus : paymentMethod === "cod" ? "pending" : "processing",
  totalAmount : totalCartAmount,
  orderDate : new Date(),
  orderUpdateDate : new Date(),
  paymentId: '',
  payerId : ''

  };
  dispatch(createNewOrder(orderData)).then((data)=>{
    if(data?.payload?.success){
      if(paymentMethod ==="paypal"){
        setIsPaymentStart(true)
      }
      else {
        toast({ title: "Order placed successfully with Cash on Delivery!", variant: "success" });
        navigate('/shop/paypal-return')
        // localStorage.setItem('orderId',orderId)
        //sessionStorage.removeItem("current_order_id")
        // localStorage.setItem('orderId',orderId)
        //dispatch(clearCart());
      }
    }else{
     setIsPaymentStart(false);
     dispatch(clearCart()) 
    }
    
  })
  
}


useEffect(() => {
  if (isPaymentStart && approvalURL && paymentMethod === "paypal") {
    window.location.href = approvalURL;
  }
}, [isPaymentStart, approvalURL, paymentMethod]);






   return(
        <div className="flex flex-col">
       <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className='h-full w-full object-cover object-center'/>
       </div>
       <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5'>
       <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress}/>
       <div className='flex flex-col gap-4'>
         {
          cartItems && cartItems?.items && cartItems?.items?.length > 0 ?
          cartItems?.items.map(item=> <UserCartItemsContent cartItem={item}/>) :
          null
         }
         <div className="mt-8 space-y-4">
    <div className="flex justify-between">
    <span className="font-bold">Total</span>
    <span className="font-bold">${totalCartAmount}</span>
    </div>
    </div>
    <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Button
                className={paymentMethod === "paypal" ? "bg-blue-500" : "bg-gray-300"}
                onClick={() => setPaymentMethod("paypal")}
              >
                PayPal
              </Button>
              <Button
                className={paymentMethod === "cod" ? "bg-green-500" : "bg-gray-300"}
                onClick={() => setPaymentMethod("cod")}
              >
                Cash on Delivery
              </Button>
            </div>
            <Button onClick={handleInitiatePaypalPayment} className="mt-4 w-full">
              {isPaymentStart && paymentMethod === "paypal"
                ? "Processing PayPal payment..."
                : "Place Order"}
            </Button>
          </div>
       </div>
       </div>
       <Footer/>
        </div>
    )
}

export default ShoppingCheckout;