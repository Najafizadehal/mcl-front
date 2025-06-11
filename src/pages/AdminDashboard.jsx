// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
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
import addIcon from '../assets/icons/add.png';
import uploadIcon from '../assets/icons/add.png'; // آیکون آپلود تصویر

import '../styles/AdminDashboard.css';
import {
  getAllProducts as fetchProductsApi,
    uploadProductImage,
    createProduct
  } from '../services/productService';export default function AdminDashboard() {
  const [view, setView] = useState('stats');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // وقتی صفحه محصولات لود شود، لیست را از سرور بگیریم
  // useEffect(() => {
  //   if (view === 'products') {
  //     fetchProducts();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [view]);

  useEffect(() => {
      if (view === 'products') {
        loadProducts();
      }
    }, [view]);

  // const fetchProducts = async () => {
    const loadProducts = async () => {

    setProductsLoading(true);
    setProductsError(null);
    try {
      // const list = await fetchProducts();
      const list = await fetchProductsApi();
      setProducts(list);
    } catch (err) {
      console.error('خطا در دریافت محصولات:', err);
      setProductsError('خطا در دریافت محصولات');
    } finally {
      setProductsLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'stats':
        return <Statistics />;
      case 'products':
        return (
          <Products
            products={products}
            loading={productsLoading}
            error={productsError}
            onRefresh={loadProducts}
          />
        );
      case 'add':
        return <AddProduct onAdded={() => { setView('products'); }} />;
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
          <button
            className={view === 'add' ? 'active' : ''}
            onClick={() => setView('add')}
          >
            <img src={addIcon} alt="افزودن محصول" width={20} height={20} />
            <span>افزودن محصول</span>
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
          <Bar dataKey="sold" name="فروش رفته" fill="var(--light-green)" barSize={20} />
          <Bar dataKey="total" name="کل موجودی" fill="var(--green)" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Products({ products, loading, error, onRefresh }) {
  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    try {
      // await deleteProduct(id);
      alert('محصول حذف شد');
      onRefresh();
    } catch (err) {
      console.error('خطا در حذف محصول:', err);
      alert('خطا در حذف محصول');
    }
  };

  // می‌توانید handleUpdate را نیز اضافه کنید در صورت نیاز

  if (loading) {
    return <p>در حال بارگذاری محصولات...</p>;
  }
  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={onRefresh}>تلاش مجدد</button>
      </div>
    );
  }
  return (
    <div className="products-page">
      <h2>محصولات</h2>
      {products.length === 0 ? (
        <p>هیچ محصولی وجود ندارد.</p>
      ) : (
        <div className="products-grid">
          {products.map(prod => (
            <div key={prod.id} className="product-item-wrapper">
              <ProductCard
                title={prod.name}
                price={prod.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                img={prod.imageUrl || ''}
                onAdd={() => console.log('افزودن به سبد:', prod.name)}
              />
              <div className="product-actions">
                {/* دکمه‌های حذف و ویرایش */}
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(prod.id)}
                >
                  حذف
                </button>
                {/* برای ویرایش می‌توانید مسیریابی به صفحه ویرایش اضافه کنید */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Orders() {
  // این بخش را متناسب با داده‌های سفارشات واقعی خود پر کنید
  const orders = [
    { id: 1, name: 'فاطمه', date: '1404/03/20', product: 'گلس شارژر', price: '300,000' },
    // ... دیگر سفارش‌ها
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

function AddProduct({ onAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('PHONE');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = e => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setFile(f);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('نام و قیمت محصول الزامی است.');
      return;
    }
    setLoading(true);
    try {
      let imageUrl = '';
      if (file) {
        console.log('در حال آپلود تصویر...');
        imageUrl = await uploadProductImage(file);
        console.log('آدرس تصویر دریافت شد:', imageUrl);
      }
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        productType: type, // مقادیری: "PHONE","REPAIR","LCD","SMALLPARTS","ACCESSORIES"
        imageUrl,          // اگر رشته خالی است، backend ممکن است default بگیرد
      };
      console.log('در حال ارسال payload به بک‌اند:', payload);
      const newProduct = await createProduct(payload);
      console.log('پاسخ بک‌اند (محصول جدید):', newProduct);
      alert('محصول با موفقیت اضافه شد!');
      // ریست فرم
      setName('');
      setDescription('');
      setPrice('');
      setType('PHONE');
      setFile(null);
      // فراخوانی callback برای بارگذاری مجدد لیست محصولات
      if (onAdded) onAdded();
    } catch (err) {
      console.error('خطا در ایجاد محصول:', err.response || err.message || err);
      if (err.response) {
        alert(`خطا از سمت سرور: ${err.response.status} - ${err.response.data?.message || ''}`);
      } else {
        alert('خطا در ارسال درخواست. شبکه یا سرور در دسترس نیست.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <WaveHeader title="افزودن محصول" />
      <form className="add-product-form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="image-upload">
          <div className="upload-icon">
            <img src={uploadIcon} alt="آپلود" />
          </div>
          <p>
            {file
              ? file.name
              : 'برای بارگذاری تصویر محصول کلیک کنید یا فایل را اینجا بکشید'}
          </p>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </label>

        <input
          type="text"
          placeholder="نام محصول"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="قیمت محصول"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="PHONE">موبایل</option>
          <option value="REPAIR">تعمیر</option>
          <option value="LCD">LCD</option>
          <option value="SMALLPARTS">قطعات کوچک</option>
          <option value="ACCESSORIES">لوازم جانبی</option>
        </select>
        <textarea
          placeholder="توضیحات"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'در حال ارسال...' : 'اضافه کردن محصول'}
        </button>
      </form>
    </div>
  );
}