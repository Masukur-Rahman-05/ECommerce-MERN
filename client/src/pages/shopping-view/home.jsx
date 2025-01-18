import { Button } from "@/components/ui/button";
import Men from "../../assets/category/men.jpg";
import Women from "../../assets/category/woman.jpg";
import Kids from "../../assets/category/kids.jpg";
import Accessories from "../../assets/category/accessories.jpg";
import Footwear from "../../assets/category/shoe.jpg";

import Nike from '../../assets/brand/nike.jpg';
import Adidas from '../../assets/brand/addidas.png';
import Puma from '../../assets/brand/puma.png';
import Levi from '../../assets/brand/levis.jpg';
import Zara from '../../assets/brand/zara.png';
import Hm from '../../assets/brand/hm.png';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: Men },
  { id: "women", label: "Women", icon: Women },
  { id: "kids", label: "Kids", icon: Kids },
  { id: "accessories", label: "Accessories", icon: Accessories },
  { id: "footwear", label: "Footwear", icon: Footwear },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Nike },
  { id: "adidas", label: "Adidas", icon: Adidas },
  { id: "puma", label: "Puma", icon: Puma },
  { id: "levi", label: "Levi's", icon: Levi },
  { id: "zara", label: "Zara", icon: Zara },
  { id: "h&m", label: "H&M", icon: Hm },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
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
    console.log(productList, "productList");
  }, [productList]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden min-h-screen">
        <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply opacity-40 animate-blob-1"></div>
        <div className="absolute w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply opacity-40 animate-blob-2"></div>
        <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply opacity-40 animate-blob-3"></div>
      </div>
      <div className="relative w-[90%] h-[450px] mx-auto mt-5 rounded-xl overflow-hidden z-20">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
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
      <section className="py-12 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem,index) => (
              <Card
                onClick={() =>{
                  console.log("category is called")
                  handleNavigateToListingPage(categoryItem, "category")
                }}
                className="cursor-pointer hover:shadow-lg transition-shadow bg-transparent border-none z-20"
                key={index}
              >
                <CardContent className="flex flex-col items-center justify-center">
                  <img
                    src={categoryItem.icon}
                    className="w-[150px] h-[150px] my-4 text-primary object-cover rounded-full"
                  />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="flex justify-evenly gap-5 mx-auto">
            {brandsWithIcon.map((brandItem,index) => (
              <Card
                onClick={() => { 
                  console.log("Brand is called")
                  handleNavigateToListingPage(brandItem, "brand")
                }}
                className="w-[200px] h-[170px] cursor-pointer hover:shadow-lg transition-shadow z-20"
                key={index}
              >
                <CardContent className="flex flex-col items-center justify-evenly p-6">
                  <img src={brandItem.icon} className="w-[100px] h-[100px]"/>
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12">
        <div className="absolute inset-0 overflow-hidden min-h-screen">
          <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply opacity-40 animate-blob-1"></div>
          <div className="absolute w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply opacity-40 animate-blob-2"></div>
          <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply opacity-40 animate-blob-3"></div>
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-20">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                    key={productItem._id}
                  />
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
    </div>
  );
}

export default ShoppingHome;
