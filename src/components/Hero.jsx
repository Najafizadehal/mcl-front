import React from 'react';
import heroImg from '../assets/hero.png';

// افزودن	selectedId برای هایلایت دسته انتخاب‌شده
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
          const isSelected = selectedId === cat.id;
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
              <circle cx="0" cy="0" r="40" fill={isSelected ? '#ccc' : 'var(--green)'} />
              <image href={cat.icon} x="-20" y="-18" width="36" height="36" />
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