import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Alert from '../common/Alert';
import { createProduct, uploadProductImage } from '../../services/productService';
import './AddProductForm.css';

const AddProductForm = ({ onAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('PHONE');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'info',
    message: '',
  });

  const showSuccessAlert = (message) => {
    setAlertConfig({
      type: 'success',
      message,
    });
    setShowAlert(true);
  };

  const showErrorAlert = (message) => {
    setAlertConfig({
      type: 'error',
      message,
    });
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !type) {
      showErrorAlert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    try {
      setLoading(true);
      let imageUrl = '';
      if (file) {
        try {
          imageUrl = await uploadProductImage(file);
          showSuccessAlert('تصویر با موفقیت آپلود شد');
        } catch (error) {
          showErrorAlert('خطا در آپلود تصویر: ' + error.message);
          return;
        }
      }

      const payload = {
        name,
        description,
        price: Number(price),
        productType: type,
        imageUrl,
      };

      await createProduct(payload);
      showSuccessAlert('محصول جدید با موفقیت اضافه شد');
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setType('PHONE');
      setFile(null);
      onAdded?.();
    } catch (error) {
      showErrorAlert('خطا در اضافه کردن محصول: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form">
      {showAlert && (
        <Alert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={handleCloseAlert}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">نام محصول *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">توضیحات</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">قیمت (تومان) *</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">نوع محصول *</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            disabled={loading}
          >
            <option value="PHONE">موبایل</option>
            <option value="REPAIR">تعمیرات</option>
            <option value="LCD">ال‌سی‌دی</option>
            <option value="SMALLPARTS">قطعات</option>
            <option value="ACCESSORIES">لوازم جانبی</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">تصویر محصول</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'در حال ثبت...' : 'افزودن محصول'}
        </button>
      </form>
    </div>
  );
};

AddProductForm.propTypes = {
  onAdded: PropTypes.func,
};

export default AddProductForm; 