import api from './api';

const BASE_PATH = '/api/discount-codes';

export async function getAllDiscountCodes() {
  const res = await api.get(BASE_PATH);
  return res.data;
}

export async function createDiscountCode({ code, value, type, validFrom, validTo, maxUses }) {
  const params = {
    code,
    value,
    type,
    validFrom,
    validTo,
    maxUses,
  };
  const res = await api.post(BASE_PATH, null, { params });
  return res.data;
}

export async function deleteDiscountCode(id) {
  await api.delete(`${BASE_PATH}/${id}`);
} 