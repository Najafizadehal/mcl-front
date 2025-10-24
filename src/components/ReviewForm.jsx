import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ onSubmit, initialRating = 0, initialComment = '', isEdit = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('لطفاً امتیاز خود را انتخاب کنید');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      if (!isEdit) {
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('خطا در ثبت نظر:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star-btn ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        aria-label={`${star} ستاره`}
      >
        ★
      </button>
    ));
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>امتیاز شما:</label>
        <div className="star-rating">
          {renderStars()}
          {rating > 0 && (
            <span className="rating-text">{rating} از 5</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="comment">نظر شما:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="نظر خود را بنویسید..."
          rows="4"
          maxLength="2000"
        />
        <span className="char-count">{comment.length} / 2000</span>
      </div>

      <button
        type="submit"
        className="submit-review-btn"
        disabled={submitting || rating === 0}
      >
        {submitting ? 'در حال ارسال...' : (isEdit ? 'بروزرسانی نظر' : 'ثبت نظر')}
      </button>
    </form>
  );
};

export default ReviewForm;

