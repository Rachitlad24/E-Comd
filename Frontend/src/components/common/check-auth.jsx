import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { OtpSent } = useSelector((state) => state.auth);

    useEffect(() => {
        if(
            location. pathname.includes("/otp") || 
            location. pathname.includes("/reset-password")
           ) {
             console.log(OtpSent,'otp');
             
             if (!OtpSent) {
               navigate("/auth/login");
             }
           }
           
             if (!isAuthenticated && !(location.pathname.includes("/login") || location.pathname.includes("/register") ||location.pathname.includes('/forgot') ||location.pathname.includes("/otp")|| location.pathname.includes('/reset-password')) ) {
                navigate("/auth/login");
             }
           
             if (isAuthenticated && (location.pathname.includes("/login") || location.pathname.includes("/register") ||location.pathname.includes('/forgot')||location.pathname.includes("/otp")|| location.pathname.includes('/reset-password'))) {
               if (user?.role === "admin") {
                 navigate("/admin/dashboard");
               } else {
                 navigate("/shop/home");
               }
             }
           
             if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("admin") || location.pathname==='/shop') {
               navigate("/unauth-page");
             }
           
             if (isAuthenticated && user?.role === "admin" && location.pathname.includes("shop")) {
               navigate("/admin/dashboard");
             }
    }, [isAuthenticated, user, location.pathname, navigate]);

    return <>{children}</>;
}

export default CheckAuth;
