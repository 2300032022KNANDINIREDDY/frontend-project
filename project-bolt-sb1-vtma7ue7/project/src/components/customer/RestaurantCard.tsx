import React from 'react';
import { Star, Clock, DollarSign, Truck } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurant: Restaurant) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <div
      onClick={() => onClick(restaurant)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full">
              Closed
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center">
          <Star className="text-yellow-400 fill-current" size={16} />
          <span className="text-sm font-medium ml-1">{restaurant.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {restaurant.cuisine}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center">
            <Truck size={16} className="mr-1" />
            <span>${restaurant.deliveryFee}</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={16} className="mr-1" />
            <span>Min: ${restaurant.minOrder}</span>
          </div>
          <div className={`flex items-center ${restaurant.isOpen ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${restaurant.isOpen ? 'bg-green-600' : 'bg-red-600'}`}></div>
            <span>{restaurant.isOpen ? 'Open' : 'Closed'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;