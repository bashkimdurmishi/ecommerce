export const OrdersService = {
  getPreviousOrders: (orders) => {
    return orders.filter((ord) => ord.isPaymentComplete === true);
  },

  getCart: (orders) => {
    return orders.filter((ord) => ord.isPaymentComplete === false);
  },

  getProductsByProductId: (products, productId) => {
    return products.find((prod) => prod.id === productId);
  },

  fetchProducts: () => {
    return fetch("https://api.npoint.io/2210873b5c32eb592634/products", {
      method: "GET",
    });
  },

  fetchOrdersByUserId: (userId) => {
    return fetch(
      `https://api.npoint.io/2210873b5c32eb592634/orders?userId=${userId}`,
      {
        method: "GET",
      }
    );
  },

  fetchBrands: () => {
    return fetch(`https://api.npoint.io/2210873b5c32eb592634/brands`, {
      method: "GET",
    });
  },

  fetchCategories: () => {
    return fetch(`https://api.npoint.io/2210873b5c32eb592634/categories`, {
      method: "GET",
    });
  },

  getBrandByBrandId: (brands, brandId) => {
    return brands.find((brand) => brand.id === brandId);
  },

  getCategoryByCategoryId: (categories, categoryId) => {
    return categories.find((category) => category.id === categoryId);
  },
};
