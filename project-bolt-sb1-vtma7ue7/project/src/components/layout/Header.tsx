import React, { useState } from 'react';
import { ShoppingCart, User, Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onAuthClick }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-600">FoodEx</h1>
            <span className="ml-2 text-sm text-gray-500 hidden sm:block">Express Delivery</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.name} ({user.role})
                </span>
                {user.role === 'customer' && (
                  <button
                    onClick={onCartClick}
                    className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <ShoppingCart size={24} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={onAuthClick}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <User size={18} className="mr-2" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {user && (
              <>
                <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                  {user.name} ({user.role})
                </div>
                {user.role === 'customer' && (
                  <button
                    onClick={() => {
                      onCartClick();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>Cart</span>
                    {totalItems > 0 && (
                      <span className="bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => {
                  onAuthClick();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-50"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;