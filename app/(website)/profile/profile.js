"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Settings, Plus, Trash2, X, Eye, Phone, Mail, LogOut } from 'lucide-react';
import { getStoredUser, logoutUser } from '@/lib/wordpress/api';
import { Country, State, City } from 'country-state-city';
import { formatPrice } from '@/lib/formatPrice';

const allCountries = Country.getAllCountries();

const selectClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent bg-white text-[#004065]";
const inputClass  = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent";

function AddressForm({ address, onChange, onDelete, canDelete }) {
  const states = address.country ? State.getStatesOfCountry(address.country) : [];
  const cities  = address.country
    ? City.getCitiesOfCountry(address.country) ?? []
    : [];

  // Filter cities by state if a state is selected and cities have stateCode
  const filteredCities = address.province && cities.some(c => c.stateCode)
    ? cities.filter(c => c.stateCode === address.province)
    : cities;

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#004065]">Address #{address.id}</h3>
        {canDelete && (
          <button onClick={() => onDelete(address.id)} className="text-red-600 hover:text-red-800 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">First Name</label>
          <input type="text" value={address.firstName}
            onChange={(e) => onChange(address.id, 'firstName', e.target.value)}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">Last Name</label>
          <input type="text" value={address.lastName}
            onChange={(e) => onChange(address.id, 'lastName', e.target.value)}
            className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#004065] mb-1">Address</label>
          <input type="text" value={address.address}
            onChange={(e) => onChange(address.id, 'address', e.target.value)}
            className={inputClass} />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">Country</label>
          <select
            value={address.country}
            onChange={(e) => onChange(address.id, { country: e.target.value, province: '', city: '' })}
            className={selectClass}
          >
            <option value="">Select country…</option>
            {allCountries.map(c => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* State / Province */}
        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">State / Province</label>
          {states.length > 0 ? (
            <select
              value={address.province}
              onChange={(e) => onChange(address.id, { province: e.target.value, city: '' })}
              className={selectClass}
            >
              <option value="">Select state…</option>
              {states.map(s => (
                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
              ))}
            </select>
          ) : (
            <input type="text" value={address.province}
              onChange={(e) => onChange(address.id, 'province', e.target.value)}
              placeholder="Enter state / province"
              className={inputClass} />
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">City</label>
          {filteredCities.length > 0 ? (
            <select
              value={address.city}
              onChange={(e) => onChange(address.id, 'city', e.target.value)}
              className={selectClass}
            >
              <option value="">Select city…</option>
              {filteredCities.map((c, i) => (
                <option key={`${c.name}-${i}`} value={c.name}>{c.name}</option>
              ))}
            </select>
          ) : (
            <input type="text" value={address.city}
              onChange={(e) => onChange(address.id, 'city', e.target.value)}
              placeholder="Enter city"
              className={inputClass} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">Postal Code</label>
          <input type="text" value={address.postalCode}
            onChange={(e) => onChange(address.id, 'postalCode', e.target.value)}
            className={inputClass} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#004065] mb-1">Email</label>
          <input type="email" value={address.email}
            onChange={(e) => onChange(address.id, 'email', e.target.value)}
            className={inputClass} />
        </div>

      </div>
    </div>
  );
}

export default function MyAccountPage() {
  const router = useRouter();
  const [wpUser, setWpUser] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  const authHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('wp_auth_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace('/signup');
      return;
    }
    setWpUser(stored);
    setAccountData(prev => ({
      ...prev,
      name: stored.name ?? '',
      email: stored.email ?? '',
    }));

    // Fetch real orders
    fetch('/api/woo/orders', { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));

    // Fetch real addresses
    fetch('/api/woo/customer', { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.billing) {
          setShippingAddresses([{
            id: 1,
            firstName: data.shipping?.first_name ?? '',
            lastName: data.shipping?.last_name ?? '',
            address: data.shipping?.address_1 ?? '',
            city: data.shipping?.city ?? '',
            province: data.shipping?.state ?? '',
            postalCode: data.shipping?.postcode ?? '',
            country: data.shipping?.country ?? '',
            email: data.billing?.email ?? '',
          }]);
          setBillingAddresses([{
            id: 1,
            firstName: data.billing?.first_name ?? '',
            lastName: data.billing?.last_name ?? '',
            address: data.billing?.address_1 ?? '',
            city: data.billing?.city ?? '',
            province: data.billing?.state ?? '',
            postalCode: data.billing?.postcode ?? '',
            country: data.billing?.country ?? '',
            email: data.billing?.email ?? '',
          }]);
        }
      })
      .catch(() => {})
      .finally(() => setAddressLoading(false));
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.replace('/signup');
  };

  const [shippingAddresses, setShippingAddresses] = useState([
    { id: 1, firstName: '', lastName: '', address: '', city: '', province: '', postalCode: '', country: '', email: '' }
  ]);

  const [billingAddresses, setBillingAddresses] = useState([
    { id: 1, firstName: '', lastName: '', address: '', city: '', province: '', postalCode: '', country: '', email: '' }
  ]);

  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [orders, setOrders] = useState([
    {
      id: '12345',
      date: '2026-01-10', 
      status: 'Delivered', 
      total: '$125.99',
      subtotal: '$125.99',
      shipping: 'Free Shipping',
      paymentMethod: 'Credit / Debit Card',
      tax: '$0.00',
      items: 3,
      image: 'https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.150.jpg',
      products: [
        { name: 'BLOOMY EARRINGS WITH LAPIS AND DIAMONDS', quantity: 1, price: '$125.99', image: 'https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.150.jpg' },

      ],
      billingAddress: {
        name: 'La Prima Gioielli',
        company: 'Nourelhoda Rajichi',
        address: 'Via Dante Alighieri, 40/A',
        city: 'Costabissara',
        postalCode: '36030',
        country: 'VICENZA',
        phone: '3401888622',
        email: 'nourelhoudiarajichi@gmail.com'
      },
      shippingAddress: {
        name: 'La Prima Gioielli',
        company: 'Nourelhoda Rajichi',
        address: 'Via Dante Alighieri, 40/A',
        city: 'Costabissara',
        postalCode: '36030',
        country: 'VICENZA'
      }
    },
    { 
      id: '12344', 
      date: '2025-12-28', 
      status: 'Shipped', 
      total: '$89.50',
      subtotal: '$89.50',
      shipping: 'Free Shipping',
      paymentMethod: 'Credit / Debit Card',
      tax: '$0.00',
      items: 2,
      image: 'https://laprimagioielli.com/wp-content/uploads/2024/07/Velluto_Bangle_yellow_gold.jpg',
      products: [
        { name: 'VELLUTO BANGLE YELLOW GOLD', quantity: 1, price: '$59.50', image: 'https://laprimagioielli.com/wp-content/uploads/2024/07/Velluto_Bangle_yellow_gold.jpg' },
        { name: 'GOLD EARRINGS', quantity: 1, price: '$30.00', image: 'https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.150.jpg' }
      ],
      billingAddress: {
        name: 'La Prima Gioielli',
        company: 'Nourelhoda Rajichi',
        address: 'Via Dante Alighieri, 40/A',
        city: 'Costabissara',
        postalCode: '36030',
        country: 'VICENZA',
        phone: '3401888622',
        email: 'nourelhoudiarajichi@gmail.com'
      },
      shippingAddress: {
        name: 'La Prima Gioielli',
        company: 'Nourelhoda Rajichi',
        address: 'Via Dante Alighieri, 40/A',
        city: 'Costabissara',
        postalCode: '36030',
        country: 'VICENZA'
      }
    },
    { 
      id: '12343', 
      date: '2025-12-15', 
      status: 'Delivered', 
      total: '$234.00',
      subtotal: '$234.00',
      shipping: 'Free Shipping',
      paymentMethod: 'Credit / Debit Card',
      tax: '$0.00',
      items: 5,
      image: 'https://laprimagioielli.com/wp-content/uploads/2024/07/bangle_diamonds_rose_gold_verona_la_prima_gioielli.1785.jpg',
      products: [
        { name: 'BANGLE DIAMONDS ROSE GOLD VERONA', quantity: 2, price: '$100.00', image: 'https://laprimagioielli.com/wp-content/uploads/2024/07/bangle_diamonds_rose_gold_verona_la_prima_gioielli.1785.jpg' },
        { name: 'BLOOMY EARRINGS', quantity: 2, price: '$50.00', image: 'https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.150.jpg' },
        { name: 'GOLD NECKLACE', quantity: 1, price: '$34.00', image: 'https://laprimagioielli.com/wp-content/uploads/2024/07/Velluto_Bangle_yellow_gold.jpg' }
      ],
      billingAddress: {
        name: 'La Prima Gioielli',
        company: 'Nourelhoda Rajichi',
        address: 'Via Dante Alighieri, 40/A',
        city: 'Costabissara',
        postalCode: '36030',
        country: 'VICENZA',
        phone: '3401888622',
        email: 'nourelhoudiarajichi@gmail.com'
      },
      shippingAddress: {
        name: 'La Prima Gioielli',
        company: 'Nourelhoda Rajichi',
        address: 'Via Dante Alighieri, 40/A',
        city: 'Costabissara',
        postalCode: '36030',
        country: 'VICENZA'
      }
    },
  ]);

  const handleShippingChange = (id, fields, value) => {
    // Accept either (id, 'field', value) or (id, { field: value, ... })
    const patch = typeof fields === 'string' ? { [fields]: value } : fields;
    setShippingAddresses(prev => prev.map(addr =>
      addr.id === id ? { ...addr, ...patch } : addr
    ));
  };

  const handleBillingChange = (id, fields, value) => {
    const patch = typeof fields === 'string' ? { [fields]: value } : fields;
    setBillingAddresses(prev => prev.map(addr =>
      addr.id === id ? { ...addr, ...patch } : addr
    ));
  };

  const handleAccountChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const addShippingAddress = () => {
    const newId = Math.max(...shippingAddresses.map(a => a.id)) + 1;
    setShippingAddresses([...shippingAddresses, {
      id: newId,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      email: ''
    }]);
  };

  const addBillingAddress = () => {
    const newId = Math.max(...billingAddresses.map(a => a.id)) + 1;
    setBillingAddresses([...billingAddresses, {
      id: newId,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      email: ''
    }]);
  };

  const deleteShippingAddress = (id) => {
    if (shippingAddresses.length > 1) {
      setShippingAddresses(shippingAddresses.filter(addr => addr.id !== id));
    } else {
      alert('You must have at least one shipping address');
    }
  };

  const deleteBillingAddress = (id) => {
    if (billingAddresses.length > 1) {
      setBillingAddresses(billingAddresses.filter(addr => addr.id !== id));
    } else {
      alert('You must have at least one billing address');
    }
  };

  const saveAddresses = async () => {
    const s = shippingAddresses[0];
    const b = billingAddresses[0];
    setSaveMsg('');
    try {
      const res = await fetch('/api/woo/customer', {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: {
            first_name: s.firstName, last_name: s.lastName,
            address_1: s.address, city: s.city,
            state: s.province, postcode: s.postalCode, country: s.country,
          },
          billing: {
            first_name: b.firstName, last_name: b.lastName,
            address_1: b.address, city: b.city,
            state: b.province, postcode: b.postalCode, country: b.country,
            email: b.email,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setSaveMsg('Saved successfully!');
    } catch {
      setSaveMsg('Failed to save. Please try again.');
    }
  };

  const handleShippingSave = saveAddresses;
  const handleBillingSave = saveAddresses;

  const [accountMsg, setAccountMsg] = useState('');
  const [accountSaving, setAccountSaving] = useState(false);

  const handleAccountSave = async () => {
    setAccountMsg('');

    if (accountData.newPassword && accountData.newPassword !== accountData.confirmPassword) {
      setAccountMsg('error:Passwords do not match.');
      return;
    }

    setAccountSaving(true);
    try {
      // Split full name into first / last for WooCommerce
      const [firstName, ...rest] = (accountData.name || '').trim().split(' ');
      const lastName = rest.join(' ');

      // 1. Update name + email via WooCommerce
      const wcRes = await fetch('/api/woo/customer', {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          billing: { email: accountData.email, first_name: firstName, last_name: lastName },
        }),
      });
      if (!wcRes.ok) throw new Error('Failed to update profile.');

      // 2. Update password via WP REST API (only if new password provided)
      if (accountData.newPassword) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('wp_auth_token') : null;
        const wpRes = await fetch(`${process.env.NEXT_PUBLIC_WP_GRAPHQL_URL?.replace('/graphql', '')}/wp-json/wp/v2/users/me`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: accountData.newPassword }),
        });
        if (!wpRes.ok) throw new Error('Failed to update password.');
        // Clear password fields after success
        setAccountData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }

      // Update stored user name
      if (typeof window !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem('wp_user') || '{}');
        stored.name = accountData.name;
        stored.email = accountData.email;
        localStorage.setItem('wp_user', JSON.stringify(stored));
      }
      setWpUser(prev => ({ ...prev, name: accountData.name, email: accountData.email }));
      setAccountMsg('success:Changes saved successfully!');
    } catch (err) {
      setAccountMsg('error:' + (err.message || 'Failed to save. Please try again.'));
    } finally {
      setAccountSaving(false);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-barlow text-[#ec9cb2] mb-8 mt-20">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {wpUser && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-[#ec9cb2] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-[#004065] truncate">{wpUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{wpUser.email}</p>
                  </div>
                </div>
              )}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-[#004065]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium text-[#004065]">Recent Orders</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'address'
                      ? 'bg-blue-50 text-[#004065]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium text-[#004065]">Shipping & Billing</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'account'
                      ? 'bg-blue-50 text-[#004065]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium text-[#004065]">Account Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-red-50 hover:text-red-600 border-t border-gray-100 mt-2 pt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold font-barlow text-[#ec9cb2] mb-6">Recent Orders</h2>
                {ordersLoading ? (
                  <p className="text-sm text-gray-400">Loading orders…</p>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-gray-400">No orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      // Support both real WooCommerce shape and hardcoded shape
                      const orderId = order.id ?? order.number;
                      const orderDate = order.date_created
                        ? new Date(order.date_created).toLocaleDateString()
                        : order.date;
                      const orderTotal = order.total ? `€ ${formatPrice(order.total)}` : order.total_formatted ?? order.total;
                      const orderStatus = order.status ?? order.status;
                      const itemCount = order.line_items?.length ?? order.items ?? 0;
                      const firstImage = order.line_items?.[0]?.image?.src ?? order.image ?? '';

                      return (
                        <div
                          key={orderId}
                          className="border border-gray-200 rounded-lg p-4 hover:border-[#004065] transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row gap-4">
                            {firstImage && (
                              <img
                                src={firstImage}
                                alt={`Order ${orderId}`}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="mb-3 sm:mb-0">
                                <p className="text-sm text-[#004065]">Order #{orderId}</p>
                                <p className="text-lg font-medium text-[#004065]">{orderTotal}</p>
                                <p className="text-sm text-[#004065]">{itemCount} items</p>
                              </div>
                              <div className="flex flex-col sm:items-end gap-2">
                                <p className="text-sm text-[#004065]">{orderDate}</p>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                  orderStatus === 'completed' || orderStatus === 'Delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : orderStatus === 'cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-[#004065]'
                                }`}>
                                  {orderStatus}
                                </span>
                                <button
                                  onClick={() => openOrderDetails({
                                    id: orderId,
                                    date: orderDate,
                                    status: orderStatus,
                                    total: orderTotal,
                                    subtotal: orderTotal,
                                    shipping: order.shipping_total && parseFloat(order.shipping_total) > 0 ? `€ ${formatPrice(order.shipping_total)}` : 'Free Shipping',
                                    paymentMethod: order.payment_method_title || order.payment_method || 'Credit / Debit Card',
                                    tax: order.total_tax ? `€ ${formatPrice(order.total_tax)}` : '€ 0,00',
                                    items: itemCount,
                                    image: firstImage,
                                    products: (order.line_items ?? []).map(l => ({
                                      name: l.name,
                                      quantity: l.quantity,
                                      price: `${parseFloat(l.total).toLocaleString("it-IT",{minimumFractionDigits:2})} €`,
                                      image: l.image?.src ?? '',
                                    })),
                                    billingAddress: {
                                      name: `${order.billing?.first_name ?? ''} ${order.billing?.last_name ?? ''}`.trim(),
                                      company: order.billing?.company ?? '',
                                      address: order.billing?.address_1 ?? '',
                                      city: order.billing?.city ?? '',
                                      postalCode: order.billing?.postcode ?? '',
                                      country: order.billing?.country ?? '',
                                      phone: order.billing?.phone ?? '',
                                      email: order.billing?.email ?? '',
                                    },
                                    shippingAddress: {
                                      name: `${order.shipping?.first_name ?? ''} ${order.shipping?.last_name ?? ''}`.trim(),
                                      company: order.shipping?.company ?? '',
                                      address: order.shipping?.address_1 ?? '',
                                      city: order.shipping?.city ?? '',
                                      postalCode: order.shipping?.postcode ?? '',
                                      country: order.shipping?.country ?? '',
                                    },
                                  })}
                                  className="flex items-center space-x-2 px-4 py-2 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#f8e3e8] hover:text-[#004065] transition-colors text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-6">
                {saveMsg && (
                  <p className={`text-sm px-4 py-2 rounded ${saveMsg.includes('Failed') ? 'text-red-500 bg-red-50' : 'text-green-700 bg-green-50'}`}>
                    {saveMsg}
                  </p>
                )}
                {/* Shipping Addresses */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold font-barlow text-[#ec9cb2]">Shipping Addresses</h2>
                    <button
                      onClick={addShippingAddress}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#ec9cb2] text-white rounded-lg hover:text-[#004065] hover:bg-[#f8e3e8] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Address</span>
                    </button>
                  </div>
                  <div>
                    {shippingAddresses.map((address) => (
                      <AddressForm
                        key={address.id}
                        address={address}
                        onChange={handleShippingChange}
                        onDelete={deleteShippingAddress}
                        canDelete={shippingAddresses.length > 1}
                      />
                    ))}
                    <button
                      onClick={handleShippingSave}
                      className="mt-4 px-6 py-2 bg-[#ec9cb2] text-white rounded-lg hover:text-[#004065] hover:bg-[#f8e3e8] transition-colors"
                    >
                      Save 
                    </button>
                  </div>
                </div>

                {/* Billing Addresses */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold font-barlow text-[#ec9cb2]">Billing Addresses</h2>
                    <button
                      onClick={addBillingAddress}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#ec9cb2] text-white rounded-lg hover:text-[#004065] hover:bg-[#f8e3e8] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Address</span>
                    </button>
                  </div>
                  <div>
                    {billingAddresses.map((address) => (
                      <AddressForm
                        key={address.id}
                        address={address}
                        onChange={handleBillingChange}
                        onDelete={deleteBillingAddress}
                        canDelete={billingAddresses.length > 1}
                      />
                    ))}
                    <button
                      onClick={handleBillingSave}
                      className="mt-4 px-6 py-2 bg-[#ec9cb2] text-white rounded-lg hover:text-[#004065] hover:bg-[#f8e3e8] transition-colors"
                    >
                      Save 
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold font-barlow text-[#ec9cb2] mb-6">Account Settings</h2>
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#004065] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={accountData.name}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#004065] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={accountData.email}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
                      />
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <h3 className="text-lg font-medium font-barlow text-[#004065] mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#004065] mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={accountData.currentPassword}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#004065] mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={accountData.newPassword}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#004065] mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={accountData.confirmPassword}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {accountMsg && (
                    <p className={`mt-4 text-sm px-4 py-2 rounded ${accountMsg.startsWith('error:') ? 'text-red-500 bg-red-50' : 'text-green-700 bg-green-50'}`}>
                      {accountMsg.replace(/^(error:|success:)/, '')}
                    </p>
                  )}
                  <button
                    onClick={handleAccountSave}
                    disabled={accountSaving}
                    className="mt-4 px-6 py-2 bg-[#ec9cb2] text-white rounded-lg hover:text-[#004065] hover:bg-[#f8e3e8] transition-colors disabled:opacity-50"
                  >
                    {accountSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#004065]">Order #{selectedOrder.id}</h2>
                <p className="text-sm text-gray-600">
                  Placed on {selectedOrder.date} - Status: {selectedOrder.status}
                </p>
              </div>
              <button
                onClick={closeOrderModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Order Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#004065] mb-4 uppercase">Order Details</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-[#004065] uppercase">Product</th>
                        <th className="text-right p-4 text-sm font-medium text-[#004065] uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((product, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium text-[#004065]">{product.name}</p>
                                <p className="text-sm text-gray-600">× {product.quantity}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right font-medium text-[#004065]">{product.price}</td>
                        </tr>
                      ))}
                      <tr className="border-b border-gray-200">
                        <td className="p-4 text-[#004065] uppercase font-medium">Subtotal:</td>
                        <td className="p-4 text-right text-[#004065]">{selectedOrder.subtotal}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-4 text-[#004065] uppercase font-medium">Shipping:</td>
                        <td className="p-4 text-right text-[#004065]">{selectedOrder.shipping}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-4 text-[#004065] uppercase font-medium">Payment Method:</td>
                        <td className="p-4 text-right text-[#004065]">{selectedOrder.paymentMethod}</td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="p-4 text-[#004065] uppercase font-bold">Total:</td>
                        <td className="p-4 text-right text-[#004065] font-bold text-lg">
                          {selectedOrder.total} <span className="text-sm font-normal">(Includes {selectedOrder.tax} tax)</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Addresses Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing Address */}
                <div>
                  <h3 className="text-lg font-semibold text-[#004065] mb-4 uppercase">Billing Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-[#004065]">{selectedOrder.billingAddress.name}</p>
                    <p className="text-[#004065]">{selectedOrder.billingAddress.company}</p>
                    <p className="text-[#004065]">{selectedOrder.billingAddress.address}</p>
                    <p className="text-[#004065]">{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.postalCode}</p>
                    <p className="text-[#004065]">{selectedOrder.billingAddress.country}</p>
                    <p className="text-[#004065] mt-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#ec9cb2]" />
                      <span>{selectedOrder.billingAddress.phone}</span>
                    </p>
                    <p className="text-[#004065] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#ec9cb2] " />
                      <span>{selectedOrder.billingAddress.email}</span>
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-[#004065] mb-4 uppercase">Shipping Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-[#004065]">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-[#004065]">{selectedOrder.shippingAddress.company}</p>
                    <p className="text-[#004065]">{selectedOrder.shippingAddress.address}</p>
                    <p className="text-[#004065]">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    <p className="text-[#004065]">{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Again Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => alert('Order again functionality would be implemented here')}
                  className="px-8 py-3 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#f8e3e8] hover:text-[#004065] transition-colors font-medium"
                >
                  ORDER AGAIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}