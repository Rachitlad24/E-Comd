import { Route, Routes,Navigate } from "react-router-dom"
import AuthLayout from "./components/auth/Layout"
import AuthLogin from "./pages/auth/Login"
import AuthRegister from "./pages/auth/Register"
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
import ShoppingLayout from "./components/shopping-view/layout"
import NotFound from "./pages/not-found"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingAccount from "./pages/shopping-view/account"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import CheckAuth from "./components/common/check-auth"
import UnauthPage from "./pages/unauth-page"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth } from "./store/auth-slice"
import { useEffect } from "react"
import PaypalReturnPage from "./pages/shopping-view/paypal-return"
import PaymentSuccessPage from "./pages/shopping-view/payment-success"
import SearchProducts from "./pages/shopping-view/search"
import Forgot_password from "./pages/auth/Forgot_password";
import Otp_verfy from "./pages/auth/Otp_verfy";
import Update_password from "./pages/auth/Update_password";
import AboutUs from "./pages/shopping-view/aboutus";

import ContactUs from "./pages/shopping-view/contactus";
import PrivatePolicy from "./pages/shopping-view/privatepolicy";
import AdminNotification from "./pages/admin-view/notification"




function App() {
const {user,isAuthenticated,isLoading}= useSelector(state => state.auth);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(checkAuth()); // Recheck authentication after login
}, [isAuthenticated, dispatch]);

if(isLoading) return  <div className="flex items-center justify-center h-screen bg-gray-100">
<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
</div>





  

  return (
<div className="flex flex-col overflow-hidden bg-white">

  <Routes>
    <Route
    path="/"
    element={<Navigate to="/auth/register"/>
     }
    />
    {/* <Route path="/" element={<Navigate to="/auth/register"/>}/> */}
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
             <AuthLayout />
          </CheckAuth>
         }>
          {/* <Route index element={<Navigate to="login" />} /> Redirect to login */}
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot" element={<Forgot_password/>}></Route>
          <Route path="otp" element={<Otp_verfy/>}></Route>
          <Route path="reset-password" element={<Update_password/>}></Route>
        </Route>

        <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user} >
          <AdminLayout/>
          </CheckAuth>}>
            <Route  path="dashboard" element={<AdminDashboard/>}/>
            <Route  path="products" element={<AdminProducts/>}/>
            <Route  path="orders" element={<AdminOrders/>}/>
            <Route  path="features" element={<AdminFeatures/>}/>
            <Route path="notification" element={<AdminNotification/>}></Route>
        </Route>
        <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingLayout/>
          </CheckAuth>}>

        <Route path="home" element={<ShoppingHome/>}/>
        <Route path="account" element={<ShoppingAccount/>}/>
        <Route path="listing" element={<ShoppingListing/>}/>
        <Route path="checkout" element={<ShoppingCheckout/>}/>
        <Route path="paypal-return" element={<PaypalReturnPage/>}/>
        <Route path="payment-success" element={<PaymentSuccessPage/>}/>
        <Route path="search" element={<SearchProducts/>}/>
        <Route path="contact" element={<ContactUs/>} />
          <Route path="about" element={<AboutUs/>} />
          <Route path="policy" element={<PrivatePolicy/>} />
        </Route>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/unauth-page" element={<UnauthPage/>}/>
      </Routes>
</div>
  )
}

export default App
 