import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold mb-2">E-Commerce</h2>
            <p className="text-sm text-gray-400">
              Your one-stop shop for the best deals and prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/shop/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/shop/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/shop/policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Get in Touch</h3>
            <p className="flex items-center justify-center md:justify-start text-gray-400 hover:text-white">
  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@E-Commerce.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
    <Mail className="w-5 h-5 mr-2" /> support@E-Commerce.com
  </a>
</p>

            <p className="flex items-center justify-center md:justify-start text-gray-400 mt-1">
              <Phone className="w-5 h-5 mr-2" /> +1 546 799 782
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link to="https://www.facebook.com/dummy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link to="https://www.instagram.com/dummy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link to="https://www.linkedin.com/in/dummy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;