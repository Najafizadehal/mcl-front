// src/components/WaveHeader.jsx
import React from 'react';

/**
 * props:
 *  - title: عنوان بخش (مثلاً "سفارشات")
 *  - bgColor?: رنگ زمینه‌ی موج (اختیاری، پیش‌فرض سبز)
 *  - waveColor?: رنگ موج (اختیاری، پیش‌فرض سفید)
 */
const WaveHeader = ({
  title,
  bgColor = 'var(--green)',
  waveColor = '#ffffff',
}) => (
  <div className="wave-header" style={{ backgroundColor: bgColor }}>
    <h2 className="wave-header__title">{title}</h2>
    <svg
      className="wave-header__wave"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
    >
      <path
        d="M0 224 C 240 128 480 128 720 224 C 960 320 1200 320 1440 224 L1440 320H0Z"
        fill={waveColor}
      />
    </svg>
  </div>
);

export default WaveHeader;
