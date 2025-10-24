import React from 'react';
import './OrderTracking.css';

const OrderTracking = ({ order }) => {
  if (!order) {
    return <div className="order-tracking">اطلاعات سفارش یافت نشد.</div>;
  }

  // تعریف مراحل سفارش
  const orderSteps = [
    { status: 'PENDING', label: 'در انتظار تایید', icon: '🕐' },
    { status: 'PROCESSING', label: 'در حال پردازش', icon: '📦' },
    { status: 'SHIPPED', label: 'ارسال شده', icon: '🚚' },
    { status: 'DELIVERED', label: 'تحویل داده شده', icon: '✅' }
  ];

  // مراحل لغو شده و بازپرداخت
  const cancelledSteps = [
    { status: 'CANCELLED', label: 'لغو شده', icon: '❌' },
    { status: 'REFUNDED', label: 'بازپرداخت شده', icon: '💰' }
  ];

  // تعیین مرحله فعلی
  const currentStepIndex = orderSteps.findIndex(step => step.status === order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';

  // تبدیل تاریخ به فرمت فارسی
  const formatDate = (dateString) => {
    if (!dateString) return 'نامشخص';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // محاسبه زمان باقیمانده تا تحویل
  const getRemainingDays = () => {
    if (!order.estimatedDeliveryDate || order.status === 'DELIVERED') return null;
    const now = new Date();
    const delivery = new Date(order.estimatedDeliveryDate);
    const diffTime = delivery - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'تاخیر در تحویل';
    if (diffDays === 0) return 'امروز';
    if (diffDays === 1) return 'فردا';
    return `${diffDays} روز دیگر`;
  };

  return (
    <div className="order-tracking">
      {/* هدر اطلاعات سفارش */}
      <div className="tracking-header">
        <div className="tracking-number">
          <span className="label">شماره پیگیری:</span>
          <span className="value">{order.trackingNumber || 'N/A'}</span>
        </div>
        <div className={`tracking-status status-${order.status?.toLowerCase()}`}>
          {order.status === 'PENDING' && '🕐 در انتظار تایید'}
          {order.status === 'PROCESSING' && '📦 در حال پردازش'}
          {order.status === 'SHIPPED' && '🚚 ارسال شده'}
          {order.status === 'DELIVERED' && '✅ تحویل داده شده'}
          {order.status === 'CANCELLED' && '❌ لغو شده'}
          {order.status === 'REFUNDED' && '💰 بازپرداخت شده'}
        </div>
      </div>

      {/* نوار پیشرفت */}
      {!isCancelled && (
        <div className="tracking-progress">
          <div className="progress-bar">
            {orderSteps.map((step, index) => (
              <div
                key={step.status}
                className={`progress-step ${
                  index <= currentStepIndex ? 'completed' : ''
                } ${index === currentStepIndex ? 'active' : ''}`}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-label">{step.label}</div>
                {index < orderSteps.length - 1 && (
                  <div className={`step-line ${index < currentStepIndex ? 'completed' : ''}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* نمایش مراحل لغو/بازپرداخت */}
      {isCancelled && (
        <div className="tracking-cancelled">
          <div className="cancelled-icon">
            {order.status === 'CANCELLED' ? '❌' : '💰'}
          </div>
          <div className="cancelled-text">
            {order.status === 'CANCELLED' ? 'این سفارش لغو شده است' : 'مبلغ سفارش بازپرداخت شده است'}
          </div>
        </div>
      )}

      {/* جزئیات تحویل */}
      <div className="tracking-details">
        <div className="detail-row">
          <span className="detail-label">تاریخ ثبت سفارش:</span>
          <span className="detail-value">{formatDate(order.orderDate)}</span>
        </div>

        {order.estimatedDeliveryDate && !isCancelled && (
          <div className="detail-row">
            <span className="detail-label">تاریخ تحویل تخمینی:</span>
            <span className="detail-value">
              {formatDate(order.estimatedDeliveryDate)}
              {getRemainingDays() && (
                <span className="remaining-days"> ({getRemainingDays()})</span>
              )}
            </span>
          </div>
        )}

        {order.actualDeliveryDate && (
          <div className="detail-row">
            <span className="detail-label">تاریخ تحویل واقعی:</span>
            <span className="detail-value success">{formatDate(order.actualDeliveryDate)}</span>
          </div>
        )}

        {order.shippingAddress && (
          <div className="detail-row">
            <span className="detail-label">آدرس ارسال:</span>
            <span className="detail-value">{order.shippingAddress}</span>
          </div>
        )}

        {order.notes && (
          <div className="detail-row">
            <span className="detail-label">یادداشت:</span>
            <span className="detail-value">{order.notes}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">مبلغ کل:</span>
          <span className="detail-value price">{Number(order.totalAmount).toLocaleString()} تومان</span>
        </div>

        {order.discountAmount > 0 && (
          <div className="detail-row">
            <span className="detail-label">تخفیف:</span>
            <span className="detail-value discount">-{Number(order.discountAmount).toLocaleString()} تومان</span>
          </div>
        )}

        {order.statusUpdatedAt && (
          <div className="detail-row">
            <span className="detail-label">آخرین بروزرسانی:</span>
            <span className="detail-value">{formatDate(order.statusUpdatedAt)}</span>
          </div>
        )}
      </div>

      {/* لیست آیتم های سفارش */}
      {order.items && order.items.length > 0 && (
        <div className="tracking-items">
          <h4>محصولات سفارش</h4>
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <img 
                src={item.product?.imageUrl || '/placeholder.png'} 
                alt={item.product?.name || 'محصول'} 
                className="item-image"
              />
              <div className="item-details">
                <div className="item-name">{item.product?.name || 'نامشخص'}</div>
                <div className="item-quantity">تعداد: {item.quantity}</div>
              </div>
              <div className="item-price">
                {Number(item.product?.price || 0).toLocaleString()} تومان
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;

