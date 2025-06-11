import React, { useState } from 'react';
import WaveHeader from '../components/WaveHeader';
import ProductCard from '../components/productCart/ProductCard.jsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import menuIcon from '../assets/icons/menu.png';
import statsIcon from '../assets/icons/stats.png';
import productsIcon from '../assets/icons/products.png';
import ordersIcon from '../assets/icons/orders.png';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [view, setView] = useState('stats');

  const renderContent = () => {
    switch (view) {
      case 'stats':
        return <Statistics />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* محتوای اصلی (75%) */}
      <main className="admin-main">
        {renderContent()}
      </main>

      {/* سایدبار (25%) سمت راست */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <button className="menu-btn">
            <img src={menuIcon} alt="منو" width={24} height={24} />
          </button>
          <h1>MCL</h1>
        </div>
        <nav className="sidebar-nav">
          <button
            className={view === 'stats' ? 'active' : ''}
            onClick={() => setView('stats')}
          >
            <img src={statsIcon} alt="آمار فروش" width={20} height={20} />
            <span>آمار فروش</span>
          </button>
          <button
            className={view === 'products' ? 'active' : ''}
            onClick={() => setView('products')}
          >
            <img src={productsIcon} alt="محصولات" width={20} height={20} />
            <span>محصولات</span>
          </button>
          <button
            className={view === 'orders' ? 'active' : ''}
            onClick={() => setView('orders')}
          >
            <img src={ordersIcon} alt="سفارشات" width={20} height={20} />
            <span>سفارشات</span>
          </button>
        </nav>
      </aside>
    </div>
  );
}

function Statistics() {
  const data = [
    { name: 'قطعات ریز', total: 32, sold: 15 },
    { name: 'لوازم جانبی', total: 28, sold: 12 },
    { name: 'لوازم تعمیرات', total: 40, sold: 20 },
    { name: 'ال‌سی‌دی', total: 35, sold: 18 },
  ];

  return (
    <div className="stats-page">
      <h2 className="stats-title">آمار فروش</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: 20 }}
          />
          <Bar
            dataKey="sold"
            name="فروش رفته"
            fill="var(--light-green)"
            barSize={20}
          />
          <Bar
            dataKey="total"
            name="کل موجودی"
            fill="var(--green)"
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Products() {
  const sampleProducts = [
    { id: 1, title: 'گلس گوشی',       price: 120000, img: 'https://content.styleup.ir/uploads/2020/09/Buy-Price-super-d-screen-protector.jpg' },
    { id: 2, title: ' اسپری تمیز کننده',     price: 90000,  img: 'https://abzarakmobile.com/wp-content/uploads/2020/04/%D8%A7%D8%B3%D9%BE%D8%B1%DB%8C-%D8%AA%D9%85%DB%8C%D8%B2-%DA%A9%D9%86%D9%86%D8%AF%D9%87-%DA%86%D8%B3%D8%A8-LCD-%D9%85%DA%A9%D8%A7%D9%86%DB%8C%DA%A9-%D9%85%D8%AF%D9%84-Mechanic-N9-n9.jpg' },
    { id: 3, title: 'شارژر وایرلس',  price: 150000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKJJJ-7w0EbDCecLbXWkyZsiZlb76Ul4X8Q&s' },
    { id: 4, title: 'هندزفری بلوتوث', price: 250000, img: 'https://janebi.com/janebi/9fd2/files/420214.jpg' },
    { id: 5, title: 'کابل USB-C',     price: 40000,  img: 'https://matstore.ir/8889-superlarge_default/dobe-3m-type-c-usb-charging-cable-for-ps5-xbox-switch-mobile-phone.jpg' },
    { id: 6, title: 'پاوربانک ۱۰ هزار', price: 300000, img: 'https://statics.basalam.com/public-18/users/XyjxeL/03-18/BOJj5q2eZ8b9fYALVi3wpYNCZO1S7UtvAkRqfE5NVWAD3JG8Vo.jpg_512X512X70.jpg' },
    { id: 7, title: 'Galaxy A56', price: 300000, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrHBXecb0JuZLYkTHDoSNmv1JLIZH2R1a-HQ&s' },
    { id: 8, title: ' Iphone 13 pro ', price: 300000, img: 'https://api2.zoomit.ir/media/638bb6a3da37f663eb456cfd?w=1920&q=75' },

  ];

  const handleAdd = item => {
    console.log('افزودن به سبد:', item.title);
    // اینجا منطق اضافه کردن به سبد واقعی رو بنویسید
  };

  return (
    <div className="products-page">
      <h2>محصولات</h2>
      <div className="products-grid">
        {sampleProducts.map(prod => (
          <ProductCard
            key={prod.id}
            title={prod.title}
            price={(prod.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            img={prod.img}
            onAdd={() => handleAdd(prod)}
          />
        ))}
      </div>
    </div>
  );
}
function Orders() {
  // داده‌های فیک سفارشات
  const orders = [
    { id: 1, name: 'فاطمه', date: '1404/03/20', product: 'گلس شارژر', price: '300,000' },
    { id: 2, name: 'سارا',  date: '1404/03/19', product: 'قاب گوشی', price: '120,000' },
    { id: 3, name: 'علی',   date: '1404/03/18', product: 'هندزفری', price: '250,000' },
    { id: 4, name: 'رضا',   date: '1404/03/17', product: 'آداپتور', price: '180,000' },
    { id: 5, name: 'مینا',  date: '1404/03/16', product: 'پاوربانک', price: '350,000' },
    { id: 6, name: 'امیر',  date: '1404/03/15', product: 'گلس شارژر', price: '300,000' },
  ];

  return (
    <div className="orders-page">
       
      <h2>سفارشات</h2>
      <div className="orders-table">
        <div className="orders-header">
          <div className="col name">نام</div>
          <div className="col date">تاریخ</div>
          <div className="col product">محصول</div>
          <div className="col price">قیمت</div>
        </div>
        {orders.map(o => (
          <div key={o.id} className="orders-row">
            <div className="col name">{o.name}</div>
            <div className="col date">{o.date}</div>
            <div className="col product">{o.product}</div>
            <div className="col price">{o.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
