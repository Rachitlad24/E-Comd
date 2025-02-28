import { Outlet, useLocation } from "react-router-dom";

function AuthLayout() {
    const location = useLocation();

    // Map routes to different messages
    const messages = {
        "/auth/login": "Welcome Back! Log in to continue shopping.",
        "/auth/register": "Join Us! Create an account and start shopping.",
        "/auth/forgot": "Forgot Password? Don't worry, we got you.",
        "/auth/otp": "Enter OTP to verify your identity.",
        "/auth/reset-password": "Reset Your Password and secure your account."
    };

    // Get message based on current path, default to a generic message
    const message = messages[location.pathname] || "Welcome to Ecommerce Shopping";

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side */}
            <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12"> 
                <div className="max-w-md space-y-6 text-center text-primary-foreground">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white-400">{message}</h1>
                </div>
            </div>

            {/* Right Side (Dynamic Content) */}
            <div className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
