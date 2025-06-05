import React from 'react';
import './Home.css';
import '../components/login/Login.css'; // اگر نیاز به استایل Login دارید وارد کنید
import heroImg from './assets/hero.png'; // مسیر عکس Hero را با مسیر درست خودتان جایگزین کنید

// import heroImg   from './assets/hero.png';
import iconParts from './assets/icons/smallpart.png';
import iconLCD   from './assets/icons/lcd.png';
import iconAcc   from './assets/icons/accesories.png';
import iconTools from './assets/icons/tools.png';

const categories = [
    { id: 1, label: 'قطعات ریز',  icon: iconParts  },
    { id: 2, label: 'ال سی دی',   icon: iconLCD    },
    { id: 3, label: 'جانبی',      icon: iconAcc    },
    { id: 4, label: 'ابزارآلات',  icon: iconTools  },
  ];

// مختصات روی مسیر Bézier برای قرارگیری دقیق آیکون‌ها (x,y بر حسب viewBox 1440×320)
// این مختصات را با یک بار محاسبه‌ی getPointAtLength(pathLength * t) با tهای مناسب استخراج شده‌اند:
const categoryPositions = [
  { x: 200, y: 166, id: 1 },
  { x: 350, y: 152, id: 2 },
  { x: 500, y: 163, id: 3 },
  { x: 650, y: 199, id: 4 },
];

const Home = () => {
  return (
    <div className="home2">
      {/* Navbar */}
      <header className="navbar">
        <input
          className="search"
          type="text"
          placeholder="جست‎وجو کنید"
        />
        <h1 className="brand">Mobile Center Lamerd</h1>
        <button className="menu-btn" aria-label="Menu">
          ☰
        </button>
      </header>

      {/* بخش Hero */}
      <section className="hero">
        {/* پس‌زمینه‌ی Hero */}
        <img src={heroImg} alt="Hero Background" className="hero-bg" />

        {/* SVG موج پایین */}
        <svg
          className="hero-wave"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          {/* مسیر اصلی Bézier */}
          <path
            id="wavePath"
            d="M0 224 C 240 128 480 128 720 224 C 960 320 1200 320 1440 224 L1440 320H0Z"
            fill="#ffffff"
          />

          {/* گروه آیکون‌های دسته‌بندی روی خودِ قوس */}
          <g className="wave-category-icons">
            {categoryPositions.map((pos) => {
              // پیدا کردن label مربوط به هر id
              const category = categories.find((c) => c.id === pos.id);

              return (
                <g
                  key={pos.id}
                  // مرکزی کردن آیکون به‌وسیله‌ی translate(-r, -r)
                  transform={`translate(${pos.x}, ${pos.y})`}
                >
                  {/* دایره‌ی سبز */}
                  +<circle cx={0} cy={0} r={40} fill="var(--green)" />
<image
  href={category.icon}
  x={-20}            /* نصف عرض آیکن برای مرکزی‌کردن */
  y={-18}
  width="36"
  height="36"
/>
                  {/* متن زیر دایره */}
                  <text
                    x={0}
                    y={66}
                    fontSize="17"
                    fill="var(--green)"
                    textAnchor="middle"
                  >
                    {category.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </section>

      {/* محصولات پرفروش */}
      <section className="best-sellers">
        <h2>محصولات پرفروش</h2>
        <div className="product-strip">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="product-card" />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        {/* موج بالای Footer */}
        <svg
          className="footer-wave"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 L48 10.7 C96 21 192 43 288 64 C384 85 480 107 576 138.7 C672 171 768 213 864 197.3 C960 181 1056 107 1152 90.7 C1248 75 1344 117 1392 138.7 L1440 160 V0 H0 Z"
            fill="#ffffff"
          />
        </svg>
        <div className="footer-inner">
          
          <p>موبایل سنتر لامرد</p>
          <p>تلفن: ۰۷۱-۳۴۵۶۷۸۹</p>
          <p>ایمیل: info@example.com</p>
          <p>آدرس: خیابان مثال</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
