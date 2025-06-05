import { useNavigate } from 'react-router-dom';

/* استایل دکمه‌ها را از Login.css می‌گیریم */
import '../components/login/Login.css';
import './Home.css';

/* نمونهٔ دیتا – بعداً می‌توانی از سرور بیاوری */
import iphone15   from '../assets/phones/iphone15.png';
import galaxyS24  from '../assets/phones/iphone15.png';
import xiaomi14   from '../assets/phones/iphone15.png';

const products = [
  { id: 1, name: 'iPhone 15 Pro Max',      price: '65,000,000', img: iphone15 },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', price: '58,500,000', img: galaxyS24 },
  { id: 3, name: 'Xiaomi 14 Ultra',        price: '47,900,000', img: xiaomi14 }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* نوبار */}
      <header className="home-header">
        {/* متن وسط صفحه */}
        <h1 className="brand-title">Mobile&nbsp;Center&nbsp;Lamerd</h1>

        {/* دکمه‌ها در سمت راست */}
        <nav className="nav-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>
            ورود / ثبت‌نام
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/cart')}>
            سبد خرید
          </button>
        </nav>
      </header>

      {/* محتوا */}
      <main className="home-main">
        <h2 className="section-title">پرفروش‌ترین‌ها</h2>

        <section className="product-grid">
          {products.map(p => (
            <div key={p.id} className="product-card">
              <img src={p.img} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="price">{p.price} تومان</p>
              <button className="btn btn-primary">افزودن به سبد</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
