// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WaveHeader from '../components/WaveHeader';
import ProductCard from '../components/productCart/ProductCard.jsx';
import { getAllOrders, cancelOrder } from '../services/orderService';

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
import { getCurrentUser, updateUser } from '../services/authService';
import menuIcon from '../assets/icons/menu.png';
import statsIcon from '../assets/icons/stats.png';
import productsIcon from '../assets/icons/products.png';
import ordersIcon from '../assets/icons/orders.png';
import addIcon from '../assets/icons/add.png';
import uploadIcon from '../assets/icons/add.png';
import homeIcon from '../assets/logo.png';
import profileIcon from '../assets/icons/profileIcon.png';

import '../styles/Profile.css';

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
export default function Profile() {
  const navigate = useNavigate();
  const [view, setView] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    if (role === 'ADMIN') {
      setView('stats');
    } else {
      setView('orders');
    }
  }, []);

  /*‌ هنگام نمایش صفحهٔ محصولات، لیست را بار بگیر */
  useEffect(() => {
    if (view === 'products') loadProducts();
  }, [view]);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(user => setCurrentUser(user))
      .catch(() => setCurrentUser(null));
  }, []);

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
        return userRole === 'ADMIN' ? <Statistics /> : null;
      case 'products':
        return userRole === 'ADMIN' ? (
          <Products
            products={products}
            loading={productsLoading}
            error={productsError}
            onRefresh={loadProducts}
          />
        ) : null;
      case 'add':
        return userRole === 'ADMIN' ? <AddProduct onAdded={() => setView('products')} /> : null;
      case 'orders':
        return <Orders />;
      case 'myinfo':
        return <MyInfo />;
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
            <img src={homeIcon} alt="منو" width={40} height={60} />
          </button>
          <h1>پروفایل</h1>
        </div>

        <nav className="sidebar-nav">
        <SidebarBtn
            active={view === 'myinfo'}
            icon={profileIcon}
            label="مشخصات من"
            onClick={() => setView('myinfo')}
          />
          {userRole === 'ADMIN' && (
            <>
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
            </>
          )}
          
          <SidebarBtn
            active={view === 'orders'}
            icon={ordersIcon}
            label="سفارشات"
            onClick={() => setView('orders')}
          />
          {userRole === 'ADMIN' && (
            <SidebarBtn
              active={view === 'add'}
              icon={addIcon}
              label="افزودن محصول"
              onClick={() => setView('add')}
            />
          )}
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
  const [editFile, setEditFile] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editLoading, setEditLoading] = useState(false);

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
    setEditImageUrl(prod.imageUrl || '');
    setEditFile(null);
    setShowEdit(true);
  };

  /* ذخیره تغییرات ---------------------------------------------------- */
  const saveEdit = async () => {
    try {
      setEditLoading(true);
      
      // اگر فایل جدید انتخاب شده، آن را آپلود کنید
      let newImageUrl = editImageUrl;
      if (editFile) {
        try {
          newImageUrl = await uploadProductImage(editFile);
        } catch (err) {
          console.error('خطا در آپلود تصویر:', err);
          alert('خطا در آپلود تصویر');
          return;
        }
      }

      await updateProduct(editing.id, {
        name: editName.trim(),
        description: editDesc.trim(),
        price: parseFloat(editPrice),
        productType: editing.productType,
        imageUrl: newImageUrl,
      });
      
      alert('محصول با موفقیت بروزرسانی شد');
      setShowEdit(false);
      onRefresh();
    } catch (err) {
      console.error('خطا در بروزرسانی محصول:', err);
      alert('خطا در بروزرسانی محصول');
    } finally {
      setEditLoading(false);
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
      <h3>ویرایش محصول</h3>

      {/* پیش‌نمایش تصویر فعلی */}
      {/* {editImageUrl && ( */}
      <div className="form-group">
        <label htmlFor="edit-image">تصویر جدید (اختیاری)</label>
        <input
          id="edit-image"
          type="file"
          accept="image/*"
          onChange={(e) => setEditFile(e.target.files?.[0])}
          disabled={editLoading}
        />
      </div>
      {/* )} */}

      {/* فیلدهای دیگر بدون تغییر */}
      <input
        type="text"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        placeholder="نام محصول"
        disabled={editLoading}
      />
      <input
        type="number"
        value={editPrice}
        onChange={(e) => setEditPrice(e.target.value)}
        placeholder="قیمت محصول"
        disabled={editLoading}
      />
      <textarea
        value={editDesc}
        onChange={(e) => setEditDesc(e.target.value)}
        placeholder="توضیحات"
        disabled={editLoading}
      />

      <div className="modal-actions">
        <button 
          onClick={saveEdit} 
          disabled={editLoading}
        >
          {editLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
        <button 
          onClick={() => setShowEdit(false)}
          disabled={editLoading}
        >
          انصراف
        </button>
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersList = await getAllOrders();
      setOrders(ordersList);
    } catch (err) {
      console.error('خطا در دریافت سفارشات:', err);
      setError('خطا در دریافت سفارشات');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('آیا از کنسلی این سفارش مطمئن هستید؟')) return;
    
    try {
      await cancelOrder(orderId);
      alert('سفارش با موفقیت کنسل شد');
      loadOrders(); // بارگذاری مجدد لیست
    } catch (err) {
      console.error('خطا در کنسلی سفارش:', err);
      alert('خطا در کنسلی سفارش');
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  if (loading) return <p>در حال بارگذاری سفارشات...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-page">
      <h2>سفارشات کاربران</h2>
      
      <div className="orders-table">
        <div className="orders-header">
          <div className="col">شماره سفارش</div>
          <div className="col">کاربر</div>
          <div className="col">تاریخ</div>
          <div className="col">مبلغ کل</div>
          <div className="col">وضعیت</div>
          <div className="col">عملیات</div>
        </div>

        {orders.map((order) => (
  <div key={order.id} className="orders-row">
    <div className="col">{order.id}</div>
    <div className="col">
      {order.user ? order.user.username : 'کاربر حذف شده'}
    </div>
    <div className="col">
      {order.orderDate ? new Date(order.orderDate).toLocaleDateString('fa-IR') : 'نامشخص'}
    </div>
    <div className="col">
      {order.totalAmount ? order.totalAmount.toLocaleString('fa-IR') + ' تومان' : 'نامشخص'}
    </div>
    <div className="col status-badge" data-status={order.status?.toLowerCase() || 'unknown'}>
      {order.status || 'نامشخص'}
    </div>
    <div className="col actions">
      <button 
        className="details-btn"
        onClick={() => showOrderDetails(order)}
      >
        جزئیات
      </button>
      {order.status === 'PENDING' && (
        <button
          className="cancel-btn"
          onClick={() => handleCancelOrder(order.id)}
        >
          کنسل
        </button>
      )}
    </div>
  </div>
))}
      </div>

      {/* مودال جزئیات سفارش */}
      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <h3>جزئیات سفارش #{selectedOrder.id}</h3>
            <button 
              className="close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>
            
            <div className="order-info">
              <p><strong>کاربر:</strong> {selectedOrder.user.username}</p>
              <p><strong>تاریخ:</strong> {new Date(selectedOrder.orderDate).toLocaleString('fa-IR')}</p>
              <p><strong>وضعیت:</strong> <span className="status-badge" data-status={selectedOrder.status.toLowerCase()}>{selectedOrder.status}</span></p>
              <p><strong>مبلغ کل:</strong> {selectedOrder.totalAmount.toLocaleString('fa-IR')} تومان</p>
            </div>

            <h4>محصولات:</h4>
            <div className="order-items">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.product.imageUrl || '/placeholder-product.png'} 
                    alt={item.product.name}
                    width={50}
                    height={50}
                  />
                  <div className="item-info">
                    <p>{item.product.name}</p>
                    <p>{item.quantity} عدد × {item.priceAtPurchase.toLocaleString('fa-IR')} تومان</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

function MyInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phoneNumber: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then(u => {
        setUser(u);
        setForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          username: u.username || '',
          password: '',
          phoneNumber: u.phoneNumber || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('مشخصات کاربر یافت نشد.');
        setLoading(false);
      });
  }, [success]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess(false);
    setSaveError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSaveError(null);
    setSuccess(false);
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      password: '',
      phoneNumber: user.phoneNumber || ''
    });
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSuccess(false);
    try {
      await updateUser(user.publicId, {
        firstname: form.firstName,
        lastname: form.lastName,
        username: form.username,
        password: form.password || undefined,
        phoneNumber: form.phoneNumber
      });
      setEditMode(false);
      setSuccess(true);
    } catch (err) {
      setSaveError('خطا در ذخیره اطلاعات.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{padding: 32}}>در حال دریافت اطلاعات کاربر...</div>;
  if (error) return <div style={{padding: 32}}>{error}</div>;
  if (!user) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', background: 'none' }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 6px 32px rgba(63,191,159,0.13)',
        border: '1.5px solid var(--green, #3fbf9f)',
        padding: '40px 36px 32px 36px',
        minWidth: 340,
        maxWidth: 400,
        width: '100%',
        marginTop: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3fbf9f 60%, #e0f7f4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
        }}>
          <svg width="48" height="48" fill="#fff" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>
        </div>
        <h2 style={{
          color: 'var(--green, #3fbf9f)',
          fontWeight: 800,
          fontSize: 22,
          marginBottom: 24,
          textAlign: 'center',
          letterSpacing: 1
        }}>مشخصات من</h2>
        {editMode ? (
          <form onSubmit={handleSave} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <EditField label="نام کاربری" name="username" value={form.username} onChange={handleChange} />
            <EditField label="نام کوچک" name="firstName" value={form.firstName} onChange={handleChange} />
            <EditField label="نام بزرگ" name="lastName" value={form.lastName} onChange={handleChange} />
            <EditField label="شماره تلفن" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            <EditField label="رمز عبور جدید" name="password" value={form.password} onChange={handleChange} type="password" placeholder="در صورت نیاز به تغییر" />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" disabled={saving} style={{ background: 'var(--green, #3fbf9f)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>ذخیره</button>
              <button type="button" onClick={handleCancel} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>انصراف</button>
            </div>
            {saveError && <div style={{ color: 'red', marginTop: 8 }}>{saveError}</div>}
            {success && <div style={{ color: 'var(--green, #3fbf9f)', marginTop: 8 }}>اطلاعات با موفقیت ذخیره شد.</div>}
          </form>
        ) : (
          <>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <InfoRow label="نام کاربری" value={user.username} />
              <InfoRow label="نام کوچک" value={user.firstName} />
              <InfoRow label="نام بزرگ" value={user.lastName} />
              <InfoRow label="شماره تلفن" value={user.phoneNumber} />
            </div>
            <button onClick={handleEdit} style={{ marginTop: 24, background: 'var(--green, #3fbf9f)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>ویرایش</button>
          </>
        )}
      </div>
    </div>
  );
}

function EditField({ label, name, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={name} style={{ color: '#222', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{label}:</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          border: '1.5px solid var(--green, #3fbf9f)',
          borderRadius: 7,
          padding: '8px 12px',
          fontSize: 15,
          fontWeight: 600,
          color: '#222',
          outline: 'none',
          background: '#f8fefd',
          transition: 'border 0.2s',
        }}
        autoComplete="off"
      />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(63,191,159,0.07)', borderRadius: 8, padding: '12px 18px' }}>
      <span style={{ color: '#222', fontWeight: 700, fontSize: 15 }}>{label}:</span>
      <span style={{ color: 'var(--green, #3fbf9f)', fontWeight: 700, fontSize: 15 }}>{value || <span style={{color:'#888'}}>—</span>}</span>
    </div>
  );
}
