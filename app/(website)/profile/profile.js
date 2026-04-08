"use client";
import { useState } from 'react';
import { User, Package, MapPin, Settings, Plus, Trash2, X, Eye,Phone, Mail } from 'lucide-react';

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const [shippingAddresses, setShippingAddresses] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'United States',
      email: 'john.doe@example.com'
    }
  ]);

  const [billingAddresses, setBillingAddresses] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'United States',
      email: 'john.doe@example.com'
    }
  ]);

  const [accountData, setAccountData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [orders] = useState([
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

  const handleShippingChange = (id, field, value) => {
    setShippingAddresses(shippingAddresses.map(addr => 
      addr.id === id ? { ...addr, [field]: value } : addr
    ));
  };

  const handleBillingChange = (id, field, value) => {
    setBillingAddresses(billingAddresses.map(addr => 
      addr.id === id ? { ...addr, [field]: value } : addr
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

  const handleShippingSave = () => {
    alert('Shipping addresses saved successfully!');
  };

  const handleBillingSave = () => {
    alert('Billing addresses saved successfully!');
  };

  const handleAccountSave = () => {
    if (accountData.newPassword !== accountData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Account settings saved successfully!');
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const AddressForm = ({ address, onChange, onDelete, canDelete }) => (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#004065]">Address #{address.id}</h3>
        {canDelete && (
          <button
            onClick={() => onDelete(address.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">
            First Name
          </label>
          <input
            type="text"
            value={address.firstName}
            onChange={(e) => onChange(address.id, 'firstName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#004065]">
            Last Name
          </label>
          <input
            type="text"
            value={address.lastName}
            onChange={(e) => onChange(address.id, 'lastName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#004065] mb-1">
            Address
          </label>
          <input
            type="text"
            value={address.address}
            onChange={(e) => onChange(address.id, 'address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">
            City
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => onChange(address.id, 'city', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">
            Province/State
          </label>
          <input
            type="text"
            value={address.province}
            onChange={(e) => onChange(address.id, 'province', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">
            Postal Code
          </label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => onChange(address.id, 'postalCode', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#004065] mb-1">
            Country
          </label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => onChange(address.id, 'country', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#004065] mb-1">
            Email
          </label>
          <input
            type="email"
            value={address.email}
            onChange={(e) => onChange(address.id, 'email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004065] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-barlow text-[#ec9cb2] mb-8 mt-20">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
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
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold font-barlow text-[#ec9cb2] mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#004065] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <img 
                          src={order.image} 
                          alt={`Order ${order.id}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="mb-3 sm:mb-0">
                            <p className="text-sm text-[#004065]">Order #{order.id}</p>
                            <p className="text-lg font-medium text-[#004065]">{order.total}</p>
                            <p className="text-sm text-[#004065]">{order.items} items</p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2">
                            <p className="text-sm text-[#004065]">{order.date}</p>
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'Delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-[#004065]'
                              }`}
                            >
                              {order.status}
                            </span>
                            <button
                              onClick={() => openOrderDetails(order)}
                              className="flex items-center space-x-2 px-4 py-2 bg-[#ec9cb2] text-white rounded-lg hover:bg-[#f8e3e8] hover:text-[#004065] transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="space-y-6">
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
                  <button
                    onClick={handleAccountSave}
                    className="mt-6 px-6 py-2 bg-[#ec9cb2] text-white rounded-lg hover:text-[#004065] hover:bg-[#f8e3e8] transition-colors"
                  >
                    Save 
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