// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import uploadIcon from '../assets/icons/add.png';
import homeIcon from '../assets/icons/menu.png';

import '../styles/AdminDashboard.css';

import {
  getAllProducts as fetchProductsApi,
  uploadProductImage,
  createProduct,
  deleteProduct,
  updateProduct,
} from '../services/productService';

/* ---------------------------------------------------------------------- */
/*  اصلی                                                                   */
/* ---------------------------------------------------------------------- */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [view, setView] = useState('stats');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  /*‌ هنگام نمایش صفحهٔ محصولات، لیست را بار بگیر */
  useEffect(() => {
    if (view === 'products') loadProducts();
  }, [view]);

  const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
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
        return <AddProduct onAdded={() => setView('products')} />;
      case 'orders':
        return <Orders />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <main className="admin-main">{renderContent()}</main>

      {/* سایدبار */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <button className="menu-btn">
            <img src={menuIcon} alt="منو" width={24} height={24} />
          </button>
          <h1>MCL</h1>
        </div>

        <nav className="sidebar-nav">
          <SidebarBtn
            active={view === 'stats'}
            icon={statsIcon}
            label="آمار فروش"
            onClick={() => setView('stats')}
          />
          <SidebarBtn
            active={view === 'products'}
            icon={productsIcon}
            label="محصولات"
            onClick={() => setView('products')}
          />
          <SidebarBtn
            active={view === 'orders'}
            icon={ordersIcon}
            label="سفارشات"
            onClick={() => setView('orders')}
          />
          <SidebarBtn
            active={view === 'add'}
            icon={addIcon}
            label="افزودن محصول"
            onClick={() => setView('add')}
          />
          <div className="sidebar-divider" />
          <SidebarBtn
            icon={homeIcon}
            label="بازگشت به صفحه اصلی"
            onClick={() => navigate('/')}
          />
        </nav>
      </aside>
    </div>
  );
}

function SidebarBtn({ active, icon, label, onClick }) {
  return (
    <button className={active ? 'active' : ''} onClick={onClick}>
      <img src={icon} alt={label} width={20} height={20} />
      <span>{label}</span>
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/*  آمار                                                                   */
/* ---------------------------------------------------------------------- */
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
          <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 20 }} />
          <Bar dataKey="sold" name="فروش رفته" fill="var(--light-green)" barSize={20} />
          <Bar dataKey="total" name="کل موجودی" fill="var(--green)" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  لیست محصولات + حذف/اصلاح/غیرفعال                                      */
/* ---------------------------------------------------------------------- */
function Products({ products, loading, error, onRefresh }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');

  /* حذف --------------------------------------------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    try {
      await deleteProduct(id);
      alert('محصول حذف شد');
      onRefresh();
    } catch (err) {
      console.error('خطا در حذف محصول:', err);
      alert('خطا در حذف محصول');
    }
  };

  /* نمایش مودال ویرایش ------------------------------------------------ */
  const openEdit = (prod) => {
    setEditing(prod);
    setEditName(prod.name);
    setEditDesc(prod.description || '');
    setEditPrice(prod.price);
    setShowEdit(true);
  };

  /* ذخیره تغییرات ---------------------------------------------------- */
  const saveEdit = async () => {
    try {
      await updateProduct(editing.id, {
        name: editName.trim(),
        description: editDesc.trim(),
        price: parseFloat(editPrice),
        productType: editing.productType,
        imageUrl: editing.imageUrl,
      });
      alert('محصول بروزرسانی شد');
      setShowEdit(false);
      onRefresh();
    } catch (err) {
      console.error('خطا در بروزرسانی محصول:', err);
      alert('خطا در بروزرسانی محصول');
    }
  };

  if (loading) return <p>در حال بارگذاری محصولات…</p>;
  if (error)
    return (
      <div>
        <p>{error}</p>
        <button onClick={onRefresh}>تلاش مجدد</button>
      </div>
    );

  return (
    <div className="products-page">
      <h2>محصولات</h2>

      {products.length === 0 ? (
        <p>هیچ محصولی وجود ندارد.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-item-wrapper">
              <ProductCard
                title={p.name}
                price={p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                img={p.imageUrl || ''}
                onAdd={() => console.log('افزودن به سبد:', p.name)}
              />

              <div className="product-actions">
                <button className="action-btn delete-btn" onClick={() => handleDelete(p.id)}>
                  حذف
                </button>
                <button className="action-btn edit-btn" onClick={() => openEdit(p)}>
                  اصلاح
                </button>
                <button className="action-btn disable-btn" onClick={() => {/* TODO */}}>
                  غیرفعال
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مودال ویرایش -------------------------------------------------- */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>اصلاح محصول</h3>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="نام محصول"
            />
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="قیمت محصول"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="توضیحات"
            />

            <div className="modal-actions">
              <button onClick={saveEdit}>ذخیره</button>
              <button onClick={() => setShowEdit(false)}>انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  سفارشات نمونه                                                         */
/* ---------------------------------------------------------------------- */
function Orders() {
  const orders = [
    { id: 1, name: 'فاطمه', date: '1404/03/20', product: 'گلس شارژر', price: '300,000' },
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

        {orders.map((o) => (
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

/* ---------------------------------------------------------------------- */
/*  افزودن محصول                                                          */
/* ---------------------------------------------------------------------- */
function AddProduct({ onAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('PHONE');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('نام و قیمت محصول الزامی است.');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';
      if (file) imageUrl = await uploadProductImage(file);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        productType: type,
        imageUrl,
      };

      await createProduct(payload);
      alert('محصول با موفقیت اضافه شد!');

      // reset form
      setName('');
      setDescription('');
      setPrice('');
      setType('PHONE');
      setFile(null);
      onAdded?.();
    } catch (err) {
      console.error('خطا در ایجاد محصول:', err);
      alert('خطا در ایجاد محصول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <WaveHeader title="افزودن محصول" />

      <form className="add-product-form" onSubmit={handleSubmit}>
        {/* آپلود تصویر -------------------------------------------------- */}
        <label htmlFor="file-upload" className="image-upload">
          <div className="upload-icon">
            <img src={uploadIcon} alt="آپلود" />
          </div>
          <p>{file ? file.name : 'برای بارگذاری تصویر کلیک کنید یا فایل را بکشید'}</p>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>

        <input
          type="text"
          placeholder="نام محصول"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="قیمت محصول"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="PHONE">موبایل</option>
          <option value="REPAIR">تعمیر</option>
          <option value="LCD">LCD</option>
          <option value="SMALLPARTS">قطعات کوچک</option>
          <option value="ACCESSORIES">لوازم جانبی</option>
        </select>

        <textarea
          placeholder="توضیحات"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'در حال ارسال…' : 'اضافه کردن محصول'}
        </button>
      </form>
    </div>
  );
}
