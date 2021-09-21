import React, { useState, useEffect } from "react";
import { OrdersService } from "./Services";

const ProductsPageAdmin = (props) => {
  let [search, setSearch] = useState("");
  let [brands, setBrands] = useState(null);
  let [categories, setCategories] = useState(null);
  let [products, setProducts] = useState([]);
  let [productsToShow, setProductsToShow] = useState([]);
  let {
    fetchProducts,
    getBrandByBrandId,
    getCategoryByCategoryId,
    fetchBrands,
    fetchCategories,
  } = OrdersService;

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
          `https://api.npoint.io/2210873b5c32eb592634/products?productName_like=${search}`,
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
    [search]
  );
  return (
    <div className="row">
      <div className="col-12">
        <div className="row p-3 header bg-light">
          <div className="col-lg-3">
            <h4>
              <i className="fa fa-suitcase"></i>&nbsp; Products&nbsp;
              <span className="badge bg-secondary">{products.length}</span>
            </h4>
          </div>
          <div className="col-lg-9">
            <input
              type="text"
              value={search}
              placeholder="Search..."
              autoFocus="autofocus"
              className="form-control"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="col-lg-10 mx-auto mb-2">
        <div className="card my-2 shadow">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Rating</th>
              </tr>
            </thead>

            <tbody>
              {productsToShow.map((product) => {
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.productName}</td>
                    <td>${product.price}</td>
                    <td>{product.brand.brandName}</td>
                    <td>{product.category.categoryName}</td>
                    <td>
                      {[...Array(product.rating).keys()].map((n) => {
                        return (
                          <i className="fa fa-star text-warning" key={n}></i>
                        );
                      })}
                      {[...Array(5 - product.rating).keys()].map((n) => {
                        return (
                          <i className="fa fa-star-o text-warning" key={n}></i>
                        );
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPageAdmin;
