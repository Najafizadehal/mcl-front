// src/services/reviewService.js
import api from './api';

const BASE_PATH = '/api/reviews';

/**
 * دریافت تمام نظرات یک محصول
 */
export async function getProductReviews(productId) {
  try {
    const res = await api.get(`${BASE_PATH}/product/${productId}`);
    return res.data;
  } catch (err) {
    console.error('خطا در دریافت نظرات:', err);
    throw err;
  }
}

/**
 * دریافت نظرات تایید شده یک محصول
 */
export async function getVerifiedProductReviews(productId) {
  try {
    const res = await api.get(`${BASE_PATH}/product/${productId}/verified`);
    return res.data;
  } catch (err) {
    console.error('خطا در دریافت نظرات تایید شده:', err);
    throw err;
  }
}

/**
 * ثبت یا بروزرسانی نظر
 */
export async function createOrUpdateReview(productId, rating, comment) {
  try {
    const res = await api.post(`${BASE_PATH}/product/${productId}`, {
      rating,
      comment
    });
    return res.data;
  } catch (err) {
    console.error('خطا در ثبت نظر:', err);
    throw err;
  }
}

/**
 * دریافت نظرات کاربر جاری
 */
export async function getMyReviews() {
  try {
    const res = await api.get(`${BASE_PATH}/my-reviews`);
    return res.data;
  } catch (err) {
    console.error('خطا در دریافت نظرات من:', err);
    throw err;
  }
}

/**
 * حذف نظر
 */
export async function deleteReview(reviewId) {
  try {
    const res = await api.delete(`${BASE_PATH}/${reviewId}`);
    return res.data;
  } catch (err) {
    console.error('خطا در حذف نظر:', err);
    throw err;
  }
}

/**
 * تایید نظر (فقط ادمین)
 */
export async function verifyReview(reviewId) {
  try {
    const res = await api.patch(`${BASE_PATH}/${reviewId}/verify`);
    return res.data;
  } catch (err) {
    console.error('خطا در تایید نظر:', err);
    throw err;
  }
}

/**
 * بررسی اینکه آیا کاربر می‌تواند نظر بدهد
 */
export async function canReview(productId) {
  try {
    const res = await api.get(`${BASE_PATH}/can-review/${productId}`);
    return res.data;
  } catch (err) {
    console.error('خطا در بررسی امکان نظر:', err);
    throw err;
  }
}

