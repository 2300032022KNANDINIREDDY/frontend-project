import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';

interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurantId }) => {
  const { state, addItem, updateQuantity } = useCart();
  const cartItem = state.items.find(cartItem => cartItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddItem = () => {
    addItem(item, restaurantId);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <img
          src={item.image}
          alt={item.name}
          className="w-full sm:w-32 h-32 object-cover"
        />
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <span className="text-orange-600 font-bold text-lg">${item.price.toFixed(2)}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {item.category}
            </span>
            
            {quantity === 0 ? (
              <button
                onClick={handleAddItem}
                disabled={!item.isAvailable}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} className="mr-1" />
                Add
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleUpdateQuantity(quantity - 1)}
                  className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-lg min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(quantity + 1)}
                  className="bg-orange-600 text-white p-1 rounded-full hover:bg-orange-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!item.isAvailable && (
        <div className="bg-red-50 border-t border-red-200 px-4 py-2">
          <span className="text-red-600 text-sm font-medium">Currently unavailable</span>
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;