import { useState } from "react";

import Header from "components/commons/Header";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import useDebounce from "hooks/useDebounce";
import { Search } from "neetoicons";
import { Spinner, Input, NoData } from "neetoui";
import { isEmpty, without } from "ramda";

import ProductListItem from "./ProductListItem";

const ProductList = () => {
  // const [products, setProducts] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const debouncedSearchKey = useDebounce(searchKey);

  const { data: { products = [] } = {}, isLoading } = useFetchProducts({
    searchTerm: debouncedSearchKey,
  });
  // console.log(data);

  // const fetchProducts = async () => {
  //   try {
  //     const { products } = await productsApi.fetch({
  //       searchTerm: debouncedSearchKey,
  //     });
  //     setProducts(products);
  //   } catch (error) {
  //     console.log("An error occurred:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, [debouncedSearchKey]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const toggleIsInCart = slug =>
    setCartItems(prevCartItems =>
      prevCartItems.includes(slug)
        ? without([slug], cartItems)
        : [slug, ...cartItems]
    );

  return (
    <div className="flex h-screen flex-col">
      <Header
        cartItemsCount={cartItems.length}
        shouldShowBackButton={false}
        title="Smile Cart"
        actionBlock={
          <Input
            placeholder="Search"
            prefix={<Search />}
            type="search"
            value={searchKey}
            onChange={event => setSearchKey(event.target.value)}
          />
        }
      />
      {isEmpty(products) || !debouncedSearchKey ? (
        <NoData className="h-full w-full" title="No products to show" />
      ) : (
        <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <ProductListItem
              key={product.slug}
              {...product}
              isInCart={cartItems.includes(product.slug)}
              toggleIsInCart={() => toggleIsInCart(product.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
