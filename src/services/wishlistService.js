import api from './api';

const BASE_PATH = '/api/wishlist';

export async function getWishlist() {
  try {
    const res = await api.get(BASE_PATH);
    return res.data;
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    throw err;
  }
}

export async function getWishlistProducts() {
  try {
    const res = await api.get(`${BASE_PATH}/products`);
    return res.data;
  } catch (err) {
    console.error('Error fetching wishlist products:', err);
    throw err;
  }
}

export async function addToWishlist(productId) {
  try {
    const res = await api.post(`${BASE_PATH}/${productId}`);
    return res.data;
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    throw err;
  }
}

export async function removeFromWishlist(productId) {
  try {
    const res = await api.delete(`${BASE_PATH}/${productId}`);
    return res.data;
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    throw err;
  }
}

export async function checkInWishlist(productId) {
  try {
    const res = await api.get(`${BASE_PATH}/check/${productId}`);
    return res.data.isInWishlist;
  } catch (err) {
    console.error('Error checking wishlist:', err);
    return false;
  }
}

export async function getWishlistCount() {
  try {
    const res = await api.get(`${BASE_PATH}/count`);
    return res.data.count;
  } catch (err) {
    console.error('Error getting wishlist count:', err);
    return 0;
  }
}

