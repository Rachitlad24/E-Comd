import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendEmail} from "@/store/shop/order-slice";
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/store/shop/cart-slice";
import { io } from "socket.io-client";

const BASEURL = import.meta.env.VITE_BACKEND_API_ROUTE;
const socket = io(BASEURL);


function PaymentSuccessPage(){
    const navigate = useNavigate();
    const { mailSending } = useSelector((state) => state.shopOrder); 
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true); 
    //const effectRan = useRef(false);

  
    

    // useEffect(() => {
    //   if (effectRan.current) return; // Prevent second execution
    // effectRan.current = true;
    //   const orderId = localStorage.getItem('orderId');
  
    //   if (orderId && user?.email) {
    //     dispatch(sendEmail({ orderId, email: user.email })).then(() => {
    //       setLoading(false); 
    //       localStorage.removeItem('orderId');
    //       if (!socket) return;

    //       socket.emit("sendNotification", {
    //         message: `Order ${orderId} is confirmed`,
    //         user: user.email, // Ensure user email is correct
    //         orderId,
    //       });
          
    //       dispatch(clearCart());
    //     });
    //   } else {
    //     setLoading(false); 
    //   }
    // }, [ dispatch,user]);
    useEffect(() => {
      console.log("🔥 useEffect triggered");
    
      const orderId = localStorage.getItem("orderId");
      console.log("📌 Retrieved orderId:", orderId);
      console.log("👤 User email:", user?.email);
    
      if (!orderId || !user?.email) {
        console.log("❌ No orderId or user email found. Exiting...");
        return;
      }
    
     
      if (sessionStorage.getItem(`emailSent_${orderId}`) === "true") {
        console.log("⚠️ Email already sent. Skipping API call.");
        return;
      }
    
      sessionStorage.setItem(`emailSent_${orderId}`, "true"); 
    
      console.log("🚀 Dispatching sendEmail...");
      dispatch(sendEmail({ orderId, email: user.email })).then(() => {
        console.log("✅ Email sent successfully!");
        setLoading(false);
        localStorage.removeItem("orderId");
    
        if (!socket) return;
        socket.emit("sendNotification", {
          message: `Order ${orderId} is confirmed`,
          user: user.email,
          orderId,
        });
    
        dispatch(clearCart());
      });
    
    }, [dispatch, user]);
    
    
  
  
    return(
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="p-10 shadow-lg rounded-2xl bg-white w-full max-w-lg text-center">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-4xl font-semibold text-black">
            Processing Successful
           </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="flex items-center justify-center gap-2 text-black mb-2">
               <span>Do not close page or click on button untill mail send </span>
            </div>
          {loading && mailSending ? ( // Show loader while email is being sent
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending confirmation email...</span>
            </div>
          ) : (
            <p className="text-lg text-gray-400">Confirmation email sent successfully!</p>
          )}
         <Button 
        disabled={mailSending}
  className="mt-6 bg-black text-white px-6 py-3 rounded-lg w-full"
  onClick={() => {
    window.location.href = '/shop/account'; // Forces direct navigation
  }}
>
  View Orders
</Button>

        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;