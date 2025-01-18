// import ProductFilter from "@/components/shopping-view/filter";
// import ProductDetailsDialog from "@/components/shopping-view/product-details";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useToast } from "@/components/ui/use-toast";
// import { sortOptions } from "@/config";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import { ArrowUpDownIcon } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";

// function createSearchParamsHelper(filterParams) {
//   const queryParams = [];

//   for (const [key, value] of Object.entries(filterParams)) {
//     if (Array.isArray(value) && value.length > 0) {
//       const paramValue = value.join(",");

//       queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
//     }
//   }

//   console.log(queryParams, "queryParams");

//   return queryParams.join("&");
// }

// function ShoppingListing() {
//   const dispatch = useDispatch();
//   const { productList, productDetails } = useSelector(
//     (state) => state.shopProducts
//   );
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { user } = useSelector((state) => state.auth);
//   const [filters, setFilters] = useState({});
//   const [sort, setSort] = useState(null);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const { toast } = useToast();

//   const categorySearchParam = searchParams.get("category");

//   function handleSort(value) {
//     setSort(value);
//   }

//   function handleFilter(getSectionId, getCurrentOption) {
//     let cpyFilters = { ...filters };
//     const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

//     if (indexOfCurrentSection === -1) {
//       cpyFilters = {
//         ...cpyFilters,
//         [getSectionId]: [getCurrentOption],
//       };
//     } else {
//       const indexOfCurrentOption =
//         cpyFilters[getSectionId].indexOf(getCurrentOption);

//       if (indexOfCurrentOption === -1)
//         cpyFilters[getSectionId].push(getCurrentOption);
//       else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
//     }

//     setFilters(cpyFilters);
//     sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
//   }

//   function handleGetProductDetails(getCurrentProductId) {
//     console.log(getCurrentProductId);
//     dispatch(fetchProductDetails(getCurrentProductId));
//   }

//   function handleAddtoCart(getCurrentProductId, getTotalStock) {
//     console.log(cartItems);
//     let getCartItems = cartItems.items || [];

//     if (getCartItems.length) {
//       const indexOfCurrentItem = getCartItems.findIndex(
//         (item) => item.productId === getCurrentProductId
//       );
//       if (indexOfCurrentItem > -1) {
//         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (getQuantity + 1 > getTotalStock) {
//           toast({
//             title: `Only ${getQuantity} quantity can be added for this item`,
//             variant: "destructive",
//           });

//           return;
//         }
//       }
//     }

//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({
//           title: "Product is added to cart",
//         });
//       }
//     });
//   }

//   useEffect(() => {
//     setSort("price-lowtohigh");
//     setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
//   }, [categorySearchParam]);

//   useEffect(() => {
//     if (filters && Object.keys(filters).length > 0) {
//       const createQueryString = createSearchParamsHelper(filters);
//       setSearchParams(new URLSearchParams(createQueryString));
//     }
//   }, [filters]);

//   useEffect(() => {
//     if (filters !== null && sort !== null)
//       dispatch(
//         fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
//       );
//   }, [dispatch, sort, filters]);

//   useEffect(() => {
//     if (productDetails !== null) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   console.log(productList, "productListproductListproductList");

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
//       <ProductFilter filters={filters} handleFilter={handleFilter} />
//       <div className="bg-background w-full rounded-lg shadow-sm">
//         <div className="p-4 border-b flex items-center justify-between">
//           <h2 className="text-lg font-extrabold">All Products</h2>
//           <div className="flex items-center gap-3">
//             <span className="text-muted-foreground">
//               {productList?.length} Products
//             </span>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-1"
//                 >
//                   <ArrowUpDownIcon className="h-4 w-4" />
//                   <span>Sort by</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-[200px]">
//                 <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
//                   {sortOptions.map((sortItem) => (
//                     <DropdownMenuRadioItem
//                       value={sortItem.id}
//                       key={sortItem.id}
//                     >
//                       {sortItem.label}
//                     </DropdownMenuRadioItem>
//                   ))}
//                 </DropdownMenuRadioGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//           {productList && productList.length > 0
//             ? productList.map((productItem) => (
//                 <ShoppingProductTile
//                   handleGetProductDetails={handleGetProductDetails}
//                   product={productItem}
//                   handleAddtoCart={handleAddtoCart}
//                 />
//               ))
//             : null}
//         </div>
//       </div>
//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div>
//   );
// }

// export default ShoppingListing;











import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, totalPages: storeTotalPages } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
    setCurrentPage(1); // Reset to first page when sorting changes
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    setCurrentPage(1); // Reset to first page when filters change
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    setCurrentPage(1); // Reset to first page when category changes
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(fetchAllFilteredProducts({ 
        filterParams: filters, 
        sortParams: sort, 
        page: currentPage, 
        size: 10 
      })).then((data) => {
        if (data?.payload?.data?.totalPages) {
          setTotalPages(data.payload.data.totalPages);
        }
      });
    }
  }, [dispatch, sort, filters, currentPage]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Update local totalPages state when store value changes
  useEffect(() => {
    if (storeTotalPages) {
      setTotalPages(storeTotalPages);
    }
  }, [storeTotalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }} 
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === i + 1} 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <ProductDetailsDialog 
        open={openDetailsDialog} 
        setOpen={setOpenDetailsDialog} 
        productDetails={productDetails} 
      />
    </div>
  );
}

export default ShoppingListing;