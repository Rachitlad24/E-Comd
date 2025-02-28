

import { useNavigate } from "react-router-dom";

function UnauthPage() {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 text-center">
            {/* 404 Image */}
            <img 
                src="https://cdn-icons-png.flaticon.com/128/3676/3676304.png" 
                alt="Page not found" 
                className="max-w-[200px] h-auto"
            />

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-gray-800 mt-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mt-2">Oops! You don't have access for this page</p>

            {/* Button to Home */}
            <button 
                onClick={() => navigate("/")} 
                className="mt-6 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
                Go to Home
            </button>
        </div>
    );
}






export default UnauthPage;
