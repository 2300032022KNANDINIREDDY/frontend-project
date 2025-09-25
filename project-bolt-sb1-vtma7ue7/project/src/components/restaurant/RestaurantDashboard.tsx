import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { MenuItem, Order, Restaurant } from '../../types';
import { mockMenuItems, mockRestaurants } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('orders');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems.filter(item => item.restaurantId === '1'));
  const [mockOrders] = useState<Order[]>([
    {
      id: '1',
      customerId: '1',
      restaurantId: '1',
      restaurant: mockRestaurants[0],
      items: mockMenuItems.slice(0, 2).map(item => ({ ...item, quantity: 1 })),
      status: 'pending',
      totalAmount: 35.98,
      deliveryAddress: '123 Main St, City, State',
      orderTime: new Date(Date.now() - 10 * 60 * 1000),
      estimatedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000),
    },
    {
      id: '2',
      customerId: '2',
      restaurantId: '1',
      restaurant: mockRestaurants[0],
      items: mockMenuItems.slice(0, 1).map(item => ({ ...item, quantity: 2 })),
      status: 'preparing',
      totalAmount: 36.97,
      deliveryAddress: '456 Oak Ave, City, State',
      orderTime: new Date(Date.now() - 30 * 60 * 1000),
      estimatedDeliveryTime: new Date(Date.now() + 10 * 60 * 1000),
    },
  ]);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleMenuItemSave = (item: MenuItem) => {
    if (editingItem) {
      setMenuItems(prev => prev.map(mi => mi.id === item.id ? item : mi));
    } else {
      setMenuItems(prev => [...prev, { ...item, id: Date.now().toString(), restaurantId: '1' }]);
    }
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleMenuItemDelete = (id: string) => {
    setMenuItems(prev => prev.filter(mi => mi.id !== id));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-orange-600 bg-orange-100';
      case 'ready': return 'text-green-600 bg-green-100';
      case 'picked_up': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-700 bg-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Restaurant Dashboard</h1>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'menu'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Menu Management
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="text-yellow-600 mr-2" size={20} />
                <span className="font-semibold text-yellow-800">Pending Orders</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {mockOrders.filter(o => o.status === 'pending').length}
              </p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="text-orange-600 mr-2" size={20} />
                <span className="font-semibold text-orange-800">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {mockOrders.filter(o => ['confirmed', 'preparing'].includes(o.status)).length}
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-600 mr-2" size={20} />
                <span className="font-semibold text-green-800">Completed Today</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {mockOrders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Time</p>
                    <p className="font-medium">{order.orderTime.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items</p>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">
                    Total: ${order.totalAmount.toFixed(2)}
                  </div>
                  
                  {order.status === 'pending' && (
                    <div className="space-x-2">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Accept
                      </button>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Decline
                      </button>
                    </div>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Start Preparing
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Mark Ready
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Menu Items</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-orange-600 font-bold">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleMenuItemDelete(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(showAddForm || editingItem) && (
            <MenuItemForm
              item={editingItem}
              onSave={handleMenuItemSave}
              onCancel={() => {
                setEditingItem(null);
                setShowAddForm(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Menu Item Form Component
const MenuItemForm: React.FC<{
  item: MenuItem | null;
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    image: item?.image || '',
    category: item?.category || '',
    isAvailable: item?.isAvailable ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: item?.id || '',
      restaurantId: item?.restaurantId || '1',
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {item ? 'Edit Menu Item' : 'Add Menu Item'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
            
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              required
            />
            
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              step="0.01"
              min="0"
              required
            />
            
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
            
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                className="mr-2"
              />
              Available
            </label>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;