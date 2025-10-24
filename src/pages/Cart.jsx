import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';
import { createOrder } from '../services/orderService';

const Cart = ({ cart, cartItems, onIncrement, onDecrement, onRemove, onClearCart }) => {
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // محاسبه مجموع
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/,/g, '')) 
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const total = calculateTotal();

  const handleCheckout = async () => {
    if (cartItems.length === 0 || checkoutLoading) return;
    
    setCheckoutLoading(true);
    try {
      const items = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));
      
      const response = await createOrder({
        items,
        discountCode: discountCode.trim() || undefined
      });

      if (response.success) {
        window.showAlert?.('سفارش با موفقیت ثبت شد!', 'success');
        onClearCart();
        navigate('/profile');
      } else {
        window.showAlert?.(response.message || 'خطا در ثبت سفارش', 'error');
      }
    } catch (e) {
      const errorMsg = e?.response?.data?.message || e?.message || 'خطا در ثبت سفارش';
      window.showAlert?.(errorMsg, 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountMessage('');
      return;
    }
    setDiscountMessage('کد تخفیف اعمال خواهد شد');
    // در backend بررسی می‌شود
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="empty-cart-icon">🛒</div>
          <h2>سبد خرید شما خالی است</h2>
          <p>به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            ادامه خرید
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* لیست محصولات */}
        <div className="cart-items-section">
          <h2 className="cart-title">سبد خرید ({cartItems.length} محصول)</h2>
          
          <div className="cart-items-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item-card">
                <img 
                  src={item.img || item.imageUrl} 
                  alt={item.title || item.name} 
                  className="cart-item-image"
                />
                
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title || item.name}</h3>
                  {item.brand && <p className="cart-item-brand">{item.brand}</p>}
                  
                  <div className="cart-item-price">
                    <span className="price-label">قیمت واحد:</span>
                    <span className="price-value">{item.price} تومان</span>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => onDecrement(item)}
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => onIncrement(item)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    {(typeof item.price === 'string' 
                      ? parseFloat(item.price.replace(/,/g, '')) * item.quantity
                      : item.price * item.quantity
                    ).toLocaleString()} تومان
                  </div>

                  <button 
                    className="remove-btn" 
                    onClick={() => onRemove(item)}
                    title="حذف از سبد"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* خلاصه سفارش */}
        <div className="cart-summary-section">
          <div className="cart-summary-card">
            <h3 className="summary-title">خلاصه سفارش</h3>

            <div className="summary-row">
              <span>تعداد محصولات:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} عدد</span>
            </div>

            <div className="summary-row">
              <span>جمع کل:</span>
              <span className="total-price">{total.toLocaleString()} تومان</span>
            </div>

            <div className="discount-section">
              <label>کد تخفیف:</label>
              <div className="discount-input-group">
                <input
                  type="text"
                  placeholder="کد تخفیف..."
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    setDiscountMessage('');
                  }}
                />
                <button 
                  className="apply-discount-btn"
                  onClick={handleApplyDiscount}
                >
                  اعمال
                </button>
              </div>
              {discountMessage && (
                <div className="discount-message">{discountMessage}</div>
              )}
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'در حال ثبت سفارش...' : 'نهایی کردن خرید'}
            </button>

            <button
              className="continue-shopping-link"
              onClick={() => navigate('/')}
            >
              ← ادامه خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

