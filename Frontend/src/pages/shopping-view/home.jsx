import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShirtIcon,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { SiNike,SiAdidas, SiPuma, SiZara   } from "react-icons/si";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages} from "@/store/common-slice";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/shopping-view/footer";
import HM from '../../assets/hm.png';
import Levis from "../../assets/levis.png";
import Women from "../../assets/women.png";
import Shoes from "../../assets/shoes.png";


const categoriesWithIcon = [
  { id: "men", label: "Men", icon: <ShirtIcon className="w-12 h-12 mb-4 text-primary"/> },
  { id: "women", label: "Women", icon: <img src={Women} alt="women" className="w-12 h-12 mb-4 text-primary"/> },
  { id: "kids", label: "Kids", icon: <BabyIcon className="w-12 h-12 mb-4 text-primary"/> },
  { id: "accessories", label: "Accessories", icon: <WatchIcon className="w-12 h-12 mb-4 text-primary"/> },
  { id: "footwear", label: "Footwear", icon: <img src={Shoes} alt="footwear" className="w-12 h-12 mb-4 text-primary"/> },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: <SiNike  className="w-12 h-12 mb-4 text-primary" />},
  { id: "adidas", label: "Adidas", icon: <SiAdidas  className="w-12 h-12 mb-4 text-primary" /> },
  { id: "puma", label: "Puma", icon: <SiPuma className="w-12 h-12 mb-4 text-primary" /> },
  { id: "levis", label: "Levis", icon: <img src={Levis} alt="levis" className="w-12 h-12 mb-4 text-primary"/> },
  { id: "zara", label: "Zara", icon: <SiZara className="w-12 h-12 mb-4 text-primary"/> },
  { id: "h&m", label: "H&M", icon: <img src={HM} alt="h&m"  className="w-12 h-12 mb-4 text-primary"/> },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {toast} = useToast();

  

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
  
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
  
    if (getTotalStock <= 0) {
      toast({
        title: "This product is out of stock",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
  
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id)); // Fetch updated cart items
        toast({
          title: "Product added to cart",
          duration:2000,
        });
      }
    });
  }
  

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[650px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-fill md:object-fill lg:object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {categoryItem.icon}
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {brandItem.icon}
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>

              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList && productList.length > 0
  ? productList.map((productItem,index) => (
    index<= 3 ? (
      <ShoppingProductTile
        key={productItem._id}
        handleGetProductDetails={handleGetProductDetails}
        product={productItem}
        handleAddtoCart={handleAddToCart}  // ✅ Pass this function
      />):null
    ))
  : null}

          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      <Footer/>
    </div>
  );
}

export default ShoppingHome;