import React, { useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import Order from "./Order";
import { OrdersService } from "./Services";

let {
  getPreviousOrders,
  getCart,
  getProductsByProductId,
  fetchProducts,
  fetchOrdersByUserId,
} = OrdersService;

export default function Dashboard() {
  let userContext = useContext(UserContext);
  let [orders, setOrders] = useState([]);
  let [showOrderDeletedAlert, setShowOrderDeletedAlert] = useState(false);
  let [showOrderPlacedAlert, setShowOrderPlacedAlert] = useState(false);

  let loadDataFromDatabase = useCallback(async () => {
    let ordersResponse = await fetchOrdersByUserId(
      userContext.user.currentUserId
    );

    if (ordersResponse.ok) {
      let ordersResponseBody = await ordersResponse.json();

      let productsResponse = await fetchProducts();

      if (productsResponse.ok) {
        let productsResponseBody = await productsResponse.json();

        ordersResponseBody.forEach((order) => {
          order.product = getProductsByProductId(
            productsResponseBody,
            order.productId
          );
        });
        setOrders(ordersResponseBody);
        let completedOrders = ordersResponseBody.filter(
          (ord) => ord.isPaymentComplete === false
        );
        userContext.setUser({
          ...userContext.user,
          currentUserOrders: completedOrders.length,
        });
      }
    }
  }, [userContext.user.currentUserId]);

  useEffect(() => {
    loadDataFromDatabase();
  }, [userContext.user.currentUserId, loadDataFromDatabase]);

  //When user clicks on Buy Now
  const onBuyNowClick = useCallback(
    async (orderId, userId, productId, quantity, value) => {
      if (window.confirm("Do you want to place order for this product?")) {
        let updateOrder = {
          id: orderId,
          productId: productId,
          userId: userId,
          quantity: quantity,
          isPaymentComplete: true,
        };
        let orderResponse = await fetch(
          `http://localhost:5000/orders/${orderId}`,
          {
            method: "PUT",
            body: JSON.stringify(updateOrder),
            headers: { "Content-type": "application/json" },
          }
        );
        let orderResponseBody = await orderResponse.json();

        if (orderResponse.ok) {
          console.log("order body", orderResponseBody);
          loadDataFromDatabase();
          setShowOrderPlacedAlert(true);
        }
      }
    },
    [loadDataFromDatabase]
  );

  //When user clicks on Delete button
  const onDeleteClick = useCallback(
    async (orderId) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        let orderResponse = await fetch(
          `http://localhost:5000/orders/${orderId}`,
          { method: "DELETE" }
        );

        if (orderResponse.ok) {
          let orderResponseBody = await orderResponse.json();
          console.log(orderResponseBody);
          loadDataFromDatabase();
          setShowOrderDeletedAlert(true);
        }
      }
    },
    [loadDataFromDatabase]
  );

  return (
    <div className="row">
      <div className="col-12 py-3 header">
        <h4 style={{ color: "#a80000" }}>
          <i className="fa fa-dashboard"></i>Dashboard{" "}
          <button
            className="btn btn-sm btn-info bg-warning text-light"
            onClick={loadDataFromDatabase}
          >
            <i className="fa fa-refresh"></i> Refresh
          </button>
        </h4>
      </div>

      <div className="col-12">
        <div className="row">
          {/*previous orders*/}
          <div className="col-6">
            <h4 className="py-2 my-2 text-info  text-warning border-bottom border-info">
              <i className="fa fa-history"></i> Previous Orders{" "}
              <span className="badge bg-warning">
                {getPreviousOrders(orders).length}
              </span>
            </h4>

            {getPreviousOrders(orders).length === 0 ? (
              <div className="text-danger">No Previous Orders</div>
            ) : null}

            {getPreviousOrders(orders).map((ord) => {
              return (
                <Order
                  key={ord.id}
                  orderId={ord.id}
                  productId={ord.productId}
                  isPaymentComplete={ord.isPaymentComplete}
                  quantity={ord.quantity}
                  prodName={ord.product.productName}
                  prodPrice={ord.product.price}
                  rating={ord.product.rating}
                  userId={userContext.user.currentUserId}
                />
              );
            })}
          </div>

          {/*Cart*/}
          <div className="col-6">
            <h4 className="py-2 my-2 text-primary border-bottom text-warning border-info">
              <i className="fa fa-shopping-cart"></i> Cart{" "}
              <span className="badge bg-danger">{getCart(orders).length}</span>
            </h4>

            {/*Order Placed Alert*/}
            {showOrderPlacedAlert && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                Your order has been placed.
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setShowOrderPlacedAlert(false)}
                ></button>
              </div>
            )}

            {/*Order Deleted Alert*/}
            {showOrderDeletedAlert && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                Your order has been deleted.
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setShowOrderDeletedAlert(false)}
                ></button>
              </div>
            )}

            {getCart(orders).length === 0 ? (
              <div className="text-danger">No Previous Orders</div>
            ) : null}

            {getCart(orders).map((ord) => {
              return (
                <Order
                  key={ord.id}
                  orderId={ord.id}
                  productId={ord.productId}
                  isPaymentComplete={ord.isPaymentComplete}
                  quantity={ord.quantity}
                  prodName={ord.product.productName}
                  prodPrice={ord.product.price}
                  rating={ord.product.rating}
                  userId={userContext.user.currentUserId}
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
