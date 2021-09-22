import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "./UserContext";
import { OrdersService } from "./Services";
import Product from "./Product";

function Store() {
  let userContext = useContext(UserContext);
  let [brands, setBrands] = useState(null);
  let [categories, setCategories] = useState(null);
  let [products, setProducts] = useState(null);
  let [productsToShow, setProductsToShow] = useState(null);
  let [search, setSearch] = useState("");

  //get Sevices
  let {
    fetchBrands,
    fetchCategories,
    fetchProducts,
    getBrandByBrandId,
    getCategoryByCategoryId,
  } = OrdersService;

  //Attaches brands and categories to each product
  useEffect(
    () =>
      (async () => {
        //Fetch Brands From DB
        let brandsResponse = await fetchBrands();
        let brandsResponseBody = await brandsResponse.json();
        brandsResponseBody.forEach((brand) => {
          brand.isChecked = true;
        });
        setBrands(brandsResponseBody);
        console.log("brands are", brandsResponseBody);

        //Fetch Categories from DB
        let categoriesResponse = await fetchCategories();
        let categoriesResponseBody = await categoriesResponse.json();
        categoriesResponseBody.forEach((category) => {
          category.isChecked = true;
        });
        setCategories(categoriesResponseBody);

        //Fetch Products from DB
        let productsResponse = await fetch(
          `http://localhost:5000/products?productName_like=${search}`,
          { method: "GET" }
        );

        if (productsResponse.ok) {
          let productsResponseBody = await productsResponse.json();

          if (productsResponseBody) {
            productsResponseBody.forEach((product) => {
              product.brand = getBrandByBrandId(
                brandsResponseBody,
                product.brandId
              );
              product.category = getCategoryByCategoryId(
                categoriesResponseBody,
                product.categoryId
              );
              product.isOrdered = false;
            });
            setProducts(productsResponseBody);
            setProductsToShow(productsResponseBody);
            console.log("products are", products);
          }
        }
      })(),
    [
      search,
      fetchBrands,
      fetchCategories,
      getBrandByBrandId,
      getCategoryByCategoryId,
    ]
  );

  //Update Products to show
  let updateProductsToShow = () => {
    console.log("categories are", categories, brands);
    setProductsToShow(
      products
        .filter((prod) => {
          return (
            categories.filter(
              (category) =>
                category.id === prod.categoryId && category.isChecked
            ).length > 0
          );
        })
        .filter((prod) => {
          return (
            brands.filter(
              (brand) => brand.id === prod.brandId && brand.isChecked
            ).length > 0
          );
        })
    );
  };

  //If a Brand checkbox is checked
  let updateBrandsIsChecked = (id) => {
    let brandsData = brands.map((brd) => {
      if (brd.id === id) brd.isChecked = !brd.isChecked;
      return brd;
    });
    setBrands(brandsData);
    updateProductsToShow();
  };

  //If a Category checkbox is checked
  let updateCategoriesIsChecked = (id) => {
    let categoriesData = categories.map((ctg) => {
      if (ctg.id === id) ctg.isChecked = !ctg.isChecked;
      return ctg;
    });
    setCategories(categoriesData);
    updateProductsToShow();
  };

  //If a new item is added to cart
  let onAddItemToCartClick = (prod) => {
    (async () => {
      let newOrder = {
        userId: userContext.user.currentUserId,
        productId: prod.id,
        quantity: 1,
        isPaymentComplete: false,
      };
      let orderResponse = await fetch(`http://localhost:5000/orders`, {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: { "Content-Type": "application/json" },
      });
      if (orderResponse.ok) {
        let orderResponseBody = await orderResponse.json();

        let prods = products.map((p) => {
          if (p.id === prod.id) p.isOrdered = true;
          return p;
        });
        setProducts(prods);
      }
    })();
  };

  return (
    <div>
      <div className="row py-3 header">
        <div className="col-lg-3">
          <h4>
            <i className="fa fa-shopping-bag"></i> Store
            <span className="badge bg-warning ms-3">
              {productsToShow && productsToShow.length} Results
            </span>
          </h4>
        </div>
        <div className="col-lg-9">
          <input
            type="text"
            value={search}
            placeholder="Search..."
            className="form-control"
            autoFocus="autofocus"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 py-2">
          <div className="my-2">
            <h5>Brands</h5>
            <ul className="list-group list-group-flush">
              {brands &&
                brands.map((brand) => {
                  return (
                    <div key={brand.id}>
                      <li className="list-group-item" key={brand.id}>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value="true"
                            checked={brand.isChecked}
                            onChange={() => {
                              updateBrandsIsChecked(brand.id);
                            }}
                            id={`brand${brand.id}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`brand${brand.id}`}
                          >
                            {brand.brandName}
                          </label>
                        </div>
                      </li>
                    </div>
                  );
                })}
            </ul>
          </div>
          <div className="my-2">
            <h5>Categories</h5>
            <ul className="list-group list-group-flush">
              {categories &&
                categories.map((category) => {
                  return (
                    <div key={category.id}>
                      <li className="list-group-item" key={category.id}>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value="true"
                            checked={category.isChecked}
                            onChange={() => {
                              updateCategoriesIsChecked(category.id);
                            }}
                            id={`brand${category.id}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`brand${category.id}`}
                          >
                            {category.categoryName}
                          </label>
                        </div>
                      </li>
                    </div>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="col-lg-9 py-2">
          <div className="row">
            {productsToShow &&
              productsToShow.map((prod) => {
                return (
                  <Product
                    key={prod.id}
                    product={prod}
                    onAddItemToCartClick={onAddItemToCartClick}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;
