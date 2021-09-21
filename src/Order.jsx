import React from "react";

function Order({
  orderId,
  productId,
  isPaymentComplete,
  quantity,
  prodName,
  prodPrice,
  rating,
  userId,
  onBuyNowClick,
  onDeleteClick,
}) {
  console.log("Order rendered", prodName);
  return (
    <div className="card my-2 shadow">
      <div className="card-body">
        <h6>
          <i className="fa fa-arrow-right"></i> {prodName}
          {!isPaymentComplete ? (
            <div className="float-end">
              <button
                className="btn btn-sm btn-info ms-2 text-light"
                onClick={() =>
                  onBuyNowClick(orderId, userId, productId, quantity, prodPrice)
                }
              >
                <i className="fa fa-truck"></i> Buy Now
              </button>
              <button
                className="btn btn-sm btn-danger ms-2 text-light"
                onClick={() => onDeleteClick(orderId)}
              >
                <i className="fa fa-trash-o"></i> Delete
              </button>
            </div>
          ) : null}
        </h6>
        <table className="table table-sm table-borderless mt-1">
          <tbody>
            <tr>
              <td style={{ width: "100px" }}> Quantity:</td>
              <td>{quantity}</td>
            </tr>
            <tr>
              <td style={{ width: "100px" }}> Price:</td>
              <td>$ {prodPrice}</td>
            </tr>
            <tr>
              <td style={{ width: "100px" }}> Rating:</td>
              <td>{rating}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(Order);
