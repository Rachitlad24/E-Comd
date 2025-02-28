import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import contact from '../../assets/ContactUs.webp';
import Footer from "../../components/shopping-view/footer";

export default function ContactUs() {
    return (
        <div>
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-5xl font-extrabold mb-8 text-black">Contact E-Commerce</h1>
                <p className="text-lg text-gray-600 mb-10">
                    We would love to hear from you. Reach out to us through any of the channels below.
                </p>

                {/* Unified Card */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                    <CardContent className="flex flex-col md:flex-row items-center gap-10">
                        {/* Image Section */}
                        <img
                            src={contact}
                            alt="Contact Us"
                            className="rounded-lg shadow-md w-full max-w-sm hover:scale-105 transition-transform duration-300"
                        />

                        {/* Contact Info Section */}
                        <div className="space-y-6 text-lg w-full">
                            <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-300">
                                <Mail className="text-blue-500" /> 
                                <span className="text-gray-700">support@E-Commerce.com</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-300">
                                <Phone className="text-blue-500" /> 
                                <span className="text-gray-700">+1 (546) 799-782</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-300">
                                <MapPin className="text-blue-500" /> 
                                <span className="text-gray-700">20 Cooper Square, New York, NY 10003, USA</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
}