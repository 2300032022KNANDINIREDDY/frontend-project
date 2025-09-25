import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import MenuItemCard from './MenuItemCard';
import OrderTracking from './OrderTracking';
import { Restaurant, MenuItem, Order } from '../../types';
import { mockRestaurants, mockMenuItems } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { state, clearCart } = useCart();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'orders'>('restaurants');

  const restaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const menuItems = mockMenuItems.filter(item => 
    selectedRestaurant ? item.restaurantId === selectedRestaurant.id : false
  );

  const cuisines = [...new Set(mockRestaurants.map(r => r.cuisine))];

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    if (state.restaurantId && state.restaurantId !== restaurant.id && state.items.length > 0) {
      const confirmSwitch = window.confirm(
        `You have items from ${state.items[0]?.name || 'another restaurant'} in your cart. Switching restaurants will clear your cart. Continue?`
      );
      if (confirmSwitch) {
        clearCart();
        setSelectedRestaurant(restaurant);
      }
    } else {
      setSelectedRestaurant(restaurant);
    }
  };

  const handleCheckout = () => {
    if (state.items.length === 0) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: user!.id,
      restaurantId: state.restaurantId!,
      restaurant: mockRestaurants.find(r => r.id === state.restaurantId)!,
      items: state.items,
      status: 'pending',
      totalAmount: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2.99,
      deliveryAddress: user?.address || '123 Main St, City, State',
      orderTime: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    };

    setActiveOrder(newOrder);
    clearCart();
    setActiveTab('orders');
    setSelectedRestaurant(null);

    // Simulate order status updates
    const statusUpdates = ['confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];
    statusUpdates.forEach((status, index) => {
      setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: status as any } : null);
      }, (index + 1) * 10000); // Update every 10 seconds
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="text-orange-600 mr-2" size={20} />
          <span className="text-gray-600">
            Delivering to: {user?.address || 'Set delivery address'}
          </span>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'restaurants'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Restaurants
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            My Orders
          </button>
        </div>
      </div>

      {activeTab === 'restaurants' && !selectedRestaurant && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white min-w-[140px]"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={handleRestaurantSelect}
              />
            ))}
          </div>

          {restaurants.length === 0 && (
            <div className="text-center py-12">
              <Search size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No restaurants found matching your criteria</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'restaurants' && selectedRestaurant && (
        <div>
          {/* Restaurant Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="text-orange-600 hover:text-orange-700 mb-4 flex items-center"
            >
              ← Back to restaurants
            </button>
            
            <div className="flex items-center">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{selectedRestaurant.name}</h1>
                <p className="text-gray-600">{selectedRestaurant.cuisine} • {selectedRestaurant.deliveryTime}</p>
                <div className="flex items-center mt-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm mr-2">
                    ⭐ {selectedRestaurant.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    Min order: ${selectedRestaurant.minOrder} • Delivery: ${selectedRestaurant.deliveryFee}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                restaurantId={selectedRestaurant.id}
              />
            ))}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No menu items available</p>
            </div>
          )}

          {/* Checkout Button */}
          {state.items.length > 0 && (
            <div className="fixed bottom-6 right-6">
              <button
                onClick={handleCheckout}
                className="bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                Checkout (${(state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 2.99).toFixed(2)})
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Tracking</h2>
          <OrderTracking order={activeOrder} />
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;