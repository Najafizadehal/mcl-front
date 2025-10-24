import React from 'react';
import './ReviewsList.css';

const ReviewsList = ({ reviews, currentUserId, onDelete }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!</p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      <h3 className="reviews-title">نظرات کاربران ({reviews.length})</h3>
      
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div className="reviewer-info">
              <div className="reviewer-avatar">
                {review.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="reviewer-name">
                  {review.user?.username || 'کاربر'}
                  {review.verified && (
                    <span className="verified-badge" title="خرید تایید شده">✓</span>
                  )}
                </div>
                <div className="review-date">{formatDate(review.createdAt)}</div>
              </div>
            </div>
            
            <div className="review-rating">
              {renderStars(review.rating)}
              <span className="rating-number">{review.rating}</span>
            </div>
          </div>

          {review.comment && (
            <div className="review-comment">
              {review.comment}
            </div>
          )}

          {currentUserId && review.user?.id === currentUserId && (
            <div className="review-actions">
              <button
                className="delete-review-btn"
                onClick={() => onDelete && onDelete(review.id)}
              >
                حذف نظر
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;

