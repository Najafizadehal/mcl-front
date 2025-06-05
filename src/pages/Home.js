// import { useNavigate } from 'react-router-dom'
import './Home.css'
import '../components/login/Login.css'
import heroImg from './assets/hero.png'

const categories = [
  { id: 1, label: 'آی‌فون و دی' },
  { id: 2, label: 'لوازم تعمیرات' },
  { id: 3, label: 'لوازم جانبی' },
  { id: 4, label: 'قطعات بُرد' }
]

const Home = () => {
  // const nav = useNavigate()

  return (
    <div className="home2">
      <header className="navbar">
        <input className="search" placeholder="جست‌وجو کنید" />
        <h1 className="brand">Mobile Center Lamerd</h1>
        <button className="menu-btn" aria-label="menu">☰</button>
      </header>

      <section className="hero">
  <img src={heroImg} alt="" className="hero-bg" />

  {/* موج سفیدِ انتهای سکشن */}
  <svg className="hero-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
  <path
    d="M0 224
       C 240 128 480 128 720 224
       C 960 320 1200 320 1440 224
       L1440 320H0Z"
    fill="#ffffff"
  />
</svg>

</section>


      <section className="categories">
        {categories.map(c => (
          <figure key={c.id}>
            <div className="cat-circle" />
            <figcaption>{c.label}</figcaption>
          </figure>
        ))}
      </section>

      <section className="best-sellers">
        <h2>محصولات پرفروش</h2>
        <div className="product-strip">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="product-card" />
          ))}
        </div>
      </section>

      <footer className="footer">
        <h3>درباره ما</h3>
        <p>
          موبایل سنتر لامرد<br />
          تلفن: ۰۷۱-۳۴۵۶۷۸۹<br />
          ایمیل: info@example.com<br />
          آدرس: خیابان ۱
        </p>
      </footer>
    </div>
  )
}

export default Home
