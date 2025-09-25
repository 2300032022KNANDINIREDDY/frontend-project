import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import AuthModal from './components/auth/AuthModal';
import CustomerDashboard from './components/customer/CustomerDashboard';
import RestaurantDashboard from './components/restaurant/RestaurantDashboard';
import DeliveryDashboard from './components/delivery/DeliveryDashboard';
import Cart from './components/customer/Cart';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-4">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                Welcome to <span className="text-orange-600">FoodEx</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your favorite restaurants, delivered fast
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍕</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">For Customers</h3>
                  <p className="text-gray-600">Browse restaurants, order food, and track delivery in real-time</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">For Restaurants</h3>
                  <p className="text-gray-600">Manage your menu, track orders, and grow your business</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">For Delivery</h3>
                  <p className="text-gray-600">Earn money delivering food with flexible schedules</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'restaurant':
        return <RestaurantDashboard />;
      case 'delivery':
        return <DeliveryDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  const handleCheckout = () => {
    setShowCart(false);
    // Checkout logic handled in CustomerDashboard
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartClick={() => setShowCart(true)}
        onAuthClick={() => setShowAuthModal(true)}
      />
      
      <main>
        {renderDashboard()}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {user?.role === 'customer' && (
        <Cart
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;