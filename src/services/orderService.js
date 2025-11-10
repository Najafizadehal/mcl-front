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
 * @param {{items: Array<{productId: number, quantity: number}>, discountCode?: string}} orderData
 * @returns {Promise<Object>} {success: boolean, data?: Object, message?: string}
 */
export async function createOrder({ items, discountCode }) {
  try {
    const res = await api.post(BASE_PATH, { items, discountCode });
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

/**
 * دریافت تمام سفارشات (ویژه ادمین)
 * @returns {Promise<Array>}
 */
export async function getAllOrdersForAdmin() {
  try {
    const res = await api.get(`${BASE_PATH}/all`);
    return res.data;
  } catch (err) {
    console.error('خطا در دریافت همه سفارشات (ادمین):', err);
    throw err;
  }
}

/**
 * تایید سفارش توسط ادمین
 * @param {string} orderId - ID سفارش
 * @returns {Promise<Object>}
 */
export async function approveOrder(orderId) {
  try {
    const res = await api.patch(`${BASE_PATH}/${orderId}/approve`);
    return res.data;
  } catch (err) {
    console.error('خطا در تایید سفارش:', err);
    throw err;
  }
}