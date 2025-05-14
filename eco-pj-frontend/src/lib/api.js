const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return handleResponse(response);
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(response);
};

export const getCart = async (token) => {
  const response = await fetch(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const addToCart = async (token, productId, quantity) => {
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(response);
};

export const updateCart = async (token, productId, quantity) => {
  const response = await fetch(`${API_URL}/cart/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(response);
};

export const removeFromCart = async (token, productId) => {
  const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getWishlist = async (token) => {
  const response = await fetch(`${API_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const addToWishlist = async (token, productId) => {
  const response = await fetch(`${API_URL}/wishlist/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
  return handleResponse(response);
};

export const removeFromWishlist = async (token, productId) => {
  const response = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createOrder = async (token, orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

export const getOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getReviews = async (productId) => {
  const response = await fetch(`${API_URL}/reviews/product/${productId}`);
  return handleResponse(response);
};

export const createReview = async (token, reviewData) => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });
  return handleResponse(response);
};

export const getAdminProducts = async (token) => {
  const response = await fetch(`${API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getAdminOrders = async (token) => {
  const response = await fetch(`${API_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getAdminUsers = async (token) => {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const deleteAdminUser = async (token, userId) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};