// src/services/orderService.js
import api from './api';

const BASE_PATH = '/api/order';

/**
 * دریافت تمام سفارشات
 * @returns {Promise<Array>}
 */
export async function getAllOrders() {
  try {
    const res = await api.get(BASE_PATH);
    return res.data;
  } catch (err) {
    console.error('خطا در دریافت سفارشات:', err);
    throw err;
  }
}

/**
 * کنسل کردن سفارش
 * @param {string} orderId - ID سفارش
 * @returns {Promise<void>}
 */
export async function cancelOrder(orderId) {
  try {
    await api.delete(`${BASE_PATH}/${orderId}`);
  } catch (err) {
    console.error('خطا در کنسلی سفارش:', err);
    throw err;
  }
}

/**
 * ایجاد سفارش جدید
 * @param {Array<{productId: number, quantity: number}>} items
 * @returns {Promise<Object>} {success: boolean, data?: Object, message?: string}
 */
export async function createOrder(items) {
  try {
    const res = await api.post(BASE_PATH, { items });
    return {
      success: true,
      data: res.data,
      message: 'سفارش با موفقیت ثبت شد'
    };
  } catch (err) {
    console.error('خطا در ایجاد سفارش:', err);
    return {
      success: false,
      message: err.response?.data?.message || 'خطا در ثبت سفارش'
    };
  }
}