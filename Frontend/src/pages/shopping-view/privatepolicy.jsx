// import React from "react";

import Footer from "@/components/shopping-view/footer";

const PrivatePolicy = () => {
  return (
    <div>
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Welcome to ShopEase! Your privacy is important to us. This Privacy
        Policy outlines how we collect, use, and protect your personal
        information when you visit and use our website and services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-2">We collect the following types of information:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Personal Information:</strong> Name, email address, phone number, billing & shipping address.</li>
        <li><strong>Payment Information:</strong> Payment details processed securely through third-party providers.</li>
        <li><strong>Account Information:</strong> Username, password, and order history.</li>
        <li><strong>Device & Usage Information:</strong> IP address, browser type, cookies, and pages visited.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="mb-2">We use the collected information for the following purposes:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>To process and fulfill your orders.</li>
        <li>To provide customer support and respond to inquiries.</li>
        <li>To improve our website and services.</li>
        <li>To send promotional emails (with your consent).</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Sharing of Information</h2>
      <p className="mb-2">We do not sell your personal information. However, we may share it with:</p>
      <ul className="list-disc ml-6 mb-4">
        <li><strong>Service Providers:</strong> Payment processors, shipping companies, and analytics providers.</li>
        <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
        <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or sale of assets.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Cookies & Tracking Technologies</h2>
      <p className="mb-2">We use cookies to enhance your experience. You can manage your cookie preferences through your browser settings.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Data Security</h2>
      <p className="mb-2">We implement industry-standard security measures to protect your data. However, no online platform is 100% secure.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p className="mb-2">Depending on your location, you may have the right to:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Access, update, or delete your personal data.</li>
        <li>Opt-out of marketing communications.</li>
        <li>Request a copy of the data we hold about you.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this policy from time to time. We encourage you to review it periodically.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:support@shopease.com" className="text-blue-600 hover:underline">support@E-Commerce.com</a>.
      </p>
    </div>
    <Footer></Footer>
    </div>
  );
};

export default PrivatePolicy;