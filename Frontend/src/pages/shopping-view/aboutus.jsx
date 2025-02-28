import about from "../../assets/About.webp"
import Footer from "../../components/shopping-view/footer";
export default function AboutUs() {
    return (
        <div>
      <div className="container mx-auto p-6">
        <h1 className="text-5xl font-extrabold mb-8 text-black text-center">About Us - E-Commerce</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img 
            src={about} 
            alt="About ShopEase" 
            className="w-full rounded-lg shadow-lg h-full"
          />
          
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              Welcome to <span className="font-semibold">E-Commerece</span>, your ultimate destination for premium fashion and lifestyle essentials.
              We bring you the finest collection of clothing, accessories, and footwear from world-renowned brands such as
              <span className="text-blue-500"> Adidas, Nike, Levi’s, Puma, and H&M</span>. At E-Commerce, we are committed to delivering the latest trends
              in fashion with the highest quality and authenticity.
            </p>
  
            <h2 className="text-2xl font-bold text-gray-800">Our Story</h2>
            <p className="text-gray-600">
              Established with a passion for fashion and a mission to bring premium clothing to everyone, E-Commerce has quickly become a trusted name in the industry.
              We understand that fashion is more than just attire—it’s an expression of individuality. That’s why we offer a diverse range of clothing, footwear,
              and accessories that cater to different styles and preferences.
            </p>
  
            <h2 className="text-2xl font-bold text-gray-800">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li><strong>Branded Clothing:</strong> Trendy and stylish outfits for men, women, and kids.</li>
              <li><strong>Footwear:</strong> Sneakers, casual shoes, and sports footwear from leading global brands.</li>
              <li><strong>Accessories:</strong> Bags, caps, belts, and more to complement your style.</li>
              <li><strong>Seasonal Collections:</strong> Stay ahead with our latest seasonal and limited-edition collections.</li>
            </ul>
          </div>
        </div>
  
        <div className="mt-10 text-left max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
          <p className="text-gray-600">
            Our mission at E-Commerce is simple: <strong>To provide a seamless and enjoyable shopping experience while offering top-quality fashion at competitive prices.</strong>
            We strive to empower individuals by making branded fashion more accessible and affordable, ensuring that every customer finds the perfect outfit that enhances their confidence and style.
          </p>
  
          <h2 className="text-2xl font-bold text-gray-800">Why Choose E-Commerce?</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>✔ A curated selection of world-class fashion brands in one place.</li>
            <li>✔ 100% genuine and authentic products with quality assurance.</li>
            <li>✔ Easy, secure, and hassle-free online shopping experience.</li>
            <li>✔ Fast, reliable, and convenient doorstep delivery.</li>
            <li>✔ Dedicated customer support to assist you at every step of your shopping journey.</li>
          </ul>
        </div>
  
        <p className="mt-8 text-lg font-semibold text-blue-700 text-center">Shop smart, shop stylish—only at E-Commerce!</p>
      </div>
      <Footer/>
      </div>
    );
  }