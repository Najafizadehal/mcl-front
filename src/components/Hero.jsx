import React from 'react';
import heroImg from '../assets/hero.png';

/**
 * props:
 *  - categories: [{ id, label, icon, size? }]
 *  - positions : [{ id, x, y }]
 *  - onCategoryClick
 *  - selectedId
 */
const Hero = ({ categories, positions, onCategoryClick, selectedId }) => (
  <section className="hero">
    <img src={heroImg} alt="Hero Background" className="hero-bg" />

    <svg className="hero-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        d="M0 224 C 240 128 480 128 720 224 C 960 320 1200 320 1440 224 L1440 320H0Z"
        fill="#ffffff"
      />

      <g className="wave-category-icons">
        {positions.map(pos => {
          const cat = categories.find(c => c.id === pos.id);
          if (!cat) return null;          // ایمنی

          const isSelected = selectedId === cat.id;
          const size  = cat.size ?? 36;   // ← اندازه سفارشی یا پیش‌فرض
          const half  = size / 2;

          return (
            <g
              key={pos.id}
              className={`cat-btn${isSelected ? ' selected' : ''}`}
              transform={`translate(${pos.x}, ${pos.y})`}
              role="button"
              tabIndex={0}
              style={{ pointerEvents: 'all', cursor: 'pointer' }}
              onClick={() => onCategoryClick?.(cat)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onCategoryClick?.(cat);
                }
              }}
            >
              {/* دایره زمینه */}
              <circle
                cx="0"
                cy="0"
                r="40"
                fill={isSelected ? '#ccc' : 'var(--green)'}
              />

              {/* آیکن در مرکز به‌اندازهٔ دلخواه */}
              <image
                href={cat.icon}
                x={-half}
                y={-half}
                width={size}
                height={size}
              />

              {/* عنوان دسته */}
              <text
                x="0"
                y="66"
                fontSize="17"
                fill={isSelected ? '#666' : 'var(--green)'}
                textAnchor="middle"
              >
                {cat.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  </section>
);

export default Hero;
