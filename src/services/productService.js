// src/services/productService.js

import api from './api';

// پایه مسیر API محصولات؛ چون در api.baseURL پایه آدرس را تنظیم کرده‌ایم:
const BASE_PATH = '/api/products';

/**
 * آپلود تصویر محصول
 * @param {File} file - فایل تصویر انتخاب‌شده
 * @returns {Promise<string>} - Promise که resolves می‌شود به URL تصویر ذخیره‌شده
 */
export async function uploadProductImage(file) {
  if (!file) {
    throw new Error('فایل معتبر نیست');
  }
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await api.post(`${BASE_PATH}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // فرض می‌شود پاسخ { url: "http://.../uploads/filename.jpg" } باشد
    return res.data.url;
  } catch (err) {
    console.error('خطا در آپلود تصویر:', err);
    // می‌توان پیام دلخواهی برگرداند یا پرش دهد:
    throw err;
  }
}

/**
 * ایجاد محصول جدید
 * @param {{name: string, description?: string, price: number, productType: string, imageUrl?: string}} productData
 * @returns {Promise<Object>} - محصول ایجادشده طبق پاسخ بک‌اند
 */
export async function createProduct(productData) {
  try {
    const res = await api.post(`${BASE_PATH}`, productData);
    return res.data;
  } catch (err) {
    console.error('خطا در ایجاد محصول:', err);
    throw err;
  }
}

/**
 * دریافت همه محصولات (با امکان فیلتر بر اساس نوع)
 * @param {string?} type - مقادیری مثل 'PHONE','REPAIR','LCD','SMALLPARTS','ACCESSORIES'
 * @returns {Promise<Array>}
 */
export async function getAllProducts(type) {
  try {
    const params = {};
    if (type) {
      params.type = type;
    }
    const res = await api.get(`${BASE_PATH}`, { params });
    return res.data;
  } catch (err) {
    console.error('خطا در دریافت محصولات:', err);
    throw err;
  }
}

/**
 * دریافت یک محصول بر اساس ID
 */
export async function getProductById(id) {
  try {
    const res = await api.get(`${BASE_PATH}/${id}`);
    return res.data;
  } catch (err) {
    console.error('خطا در دریافت محصول با id=', id, err);
    throw err;
  }
}

/**
 * بروزرسانی محصول
 */
export async function updateProduct(id, productData) {
  try {
    const res = await api.put(`${BASE_PATH}/${id}`, productData);
    return res.data;
  } catch (err) {
    console.error('خطا در بروزرسانی محصول id=', id, err);
    throw err;
  }
}

/**
 * حذف محصول
 */
export async function deleteProduct(id) {
  try {
    await api.delete(`${BASE_PATH}/${id}`);
  } catch (err) {
    console.error('خطا در حذف محصول id=', id, err);
    throw err;
  }
}
