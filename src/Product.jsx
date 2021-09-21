import React from "react";

const Product = ({ product, onAddItemToCartClick }) => {
  return (
    <div className="col-lg-6">
      <div className="card m-1">
        <div className="card-body">
          <div className="row">
            <img
              className="col-lg-12 my-auto"
              style={{ height: "300px", width: "auto", margin: "auto" }}
              src={product.img}
              alt="none"
            />
            <div className="col-lg-9 info">
              <h5>
                <i className="fa fa-arrow-right"></i> {product.productName}
              </h5>
              <div>${product.price.toFixed(2)}</div>
              <div className="mt-2">
                #{product.brand.brandName} #{product.category.categoryName}
              </div>
              <div>
                {[...Array(product.rating).keys()].map((n) => {
                  return <i className="fa fa-star text-warning" key={n}></i>;
                })}
                {[...Array(5 - product.rating).keys()].map((n) => {
                  return <i className="fa fa-star-o text-warning" key={n}></i>;
                })}
              </div>

              <div className="float-end">
                {product.isOrdered ? (
                  <span className="text-primary">Added to Cart!</span>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onAddItemToCartClick(product)}
                  >
                    <i className="fa fa-cart-plus"></i> Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
