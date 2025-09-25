import React, { useState } from 'react';
import { MapPin, Clock, Phone, CheckCircle, Navigation } from 'lucide-react';
import { Order, DeliveryPerson } from '../../types';
import { mockRestaurants } from '../../data/mockData';

const DeliveryDashboard: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState<Order | null>(null);
  const [availableOrders] = useState<Order[]>([
    {
      id: '3',
      customerId: '3',
      restaurantId: '1',
      restaurant: mockRestaurants[0],
      items: [{ 
        id: '1', 
        restaurantId: '1',
        name: 'Margherita Pizza', 
        description: 'Fresh mozzarella, tomato sauce, basil',
        price: 16.99,
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
        category: 'Pizza',
        isAvailable: true,
        quantity: 2 
      }],
      status: 'ready',
      totalAmount: 36.97,
      deliveryAddress: '789 Pine Street, City, State, 12345',
      orderTime: new Date(Date.now() - 20 * 60 * 1000),
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000),
    },
    {
      id: '4',
      customerId: '4',
      restaurantId: '2',
      restaurant: mockRestaurants[1],
      items: [{ 
        id: '3', 
        restaurantId: '2',
        name: 'Kung Pao Chicken', 
        description: 'Spicy chicken with peanuts and vegetables',
        price: 15.99,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg',
        category: 'Main Course',
        isAvailable: true,
        quantity: 1 
      }],
      status: 'ready',
      totalAmount: 21.48,
      deliveryAddress: '456 Oak Avenue, City, State, 12345',
      orderTime: new Date(Date.now() - 15 * 60 * 1000),
      estimatedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000),
    },
  ]);

  const handleAcceptOrder = (order: Order) => {
    setActiveDelivery({ ...order, status: 'picked_up' });
  };

  const handleCompleteDelivery = () => {
    setActiveDelivery(null);
  };

  const earnings = {
    today: 125.50,
    week: 892.75,
    deliveries: 18,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-3 text-sm text-gray-600">Status:</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isAvailable
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              {isAvailable ? 'Available' : 'Unavailable'}
            </button>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${earnings.today}</div>
            <div className="text-sm text-gray-600">Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${earnings.week}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{earnings.deliveries}</div>
            <div className="text-sm text-gray-600">Deliveries</div>
          </div>
        </div>
      </div>

      {/* Active Delivery */}
      {activeDelivery && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Navigation className="text-orange-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-orange-800">Active Delivery</h2>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Order #{activeDelivery.id}</span>
              <span className="text-orange-600 font-bold">${activeDelivery.totalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>Pickup: {activeDelivery.restaurant.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>Deliver to: {activeDelivery.deliveryAddress}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>Est. delivery: {activeDelivery.estimatedDeliveryTime.toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
              <div className="space-y-1">
                {activeDelivery.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Phone size={16} className="mr-2" />
                Call Customer
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <Navigation size={16} className="mr-2" />
                Navigate
              </button>
            </div>
          </div>

          <button
            onClick={handleCompleteDelivery}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <CheckCircle size={18} className="mr-2" />
            Mark as Delivered
          </button>
        </div>
      )}

      {/* Available Orders */}
      {isAvailable && !activeDelivery && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Orders</h2>
          
          {availableOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Clock size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No orders available at the moment</p>
              <p className="text-sm text-gray-400 mt-2">Check back soon for new delivery opportunities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <span className="text-green-600 font-bold text-lg">${order.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={16} className="mr-2" />
                        <span>Pickup: {order.restaurant.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span>Deliver: {order.deliveryAddress}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Clock size={16} className="mr-2" />
                        <span>Order time: {order.orderTime.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>Est. delivery: {order.estimatedDeliveryTime.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                    <div className="text-sm text-gray-600">
                      {order.items.map((item, index) => (
                        <span key={item.id}>
                          {item.quantity}x {item.name}
                          {index < order.items.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span>Distance: ~2.3 km</span> • <span>Est. time: 15 min</span>
                    </div>
                    <button
                      onClick={() => handleAcceptOrder(order)}
                      className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Accept Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isAvailable && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Clock size={64} className="mx-auto" />
          </div>
          <p className="text-gray-600 text-lg">You're currently offline</p>
          <p className="text-sm text-gray-500 mt-2">Toggle your status to "Available" to see delivery orders</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;