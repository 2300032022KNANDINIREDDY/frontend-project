import React from 'react';
import { Check, Clock, ChefHat, Truck, MapPin } from 'lucide-react';
import { Order } from '../../types';

interface OrderTrackingProps {
  order: Order | null;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  if (!order) {
    return (
      <div className="text-center py-12">
        <Clock size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No active orders</p>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Check },
    { key: 'confirmed', label: 'Confirmed', icon: Check },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: 'Ready for Pickup', icon: Clock },
    { key: 'picked_up', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: MapPin },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>From: {order.restaurant.name}</span>
          <span>Total: ${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 ${
                isCompleted
                  ? 'bg-green-600 text-white'
                  : isCurrent
                  ? 'bg-orange-600 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <Icon size={16} />
              </div>
              
              <div className="flex-1">
                <p className={`font-medium ${
                  isCompleted ? 'text-green-600' : isCurrent ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-sm text-gray-500">In progress...</p>
                )}
              </div>
              
              {isCompleted && index < statusSteps.length - 1 && (
                <div className="w-1 h-8 bg-green-600 absolute left-7 mt-8"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Estimated Delivery:</span>
            <p className="font-medium">{new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Delivery Address:</span>
            <p className="font-medium">{order.deliveryAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;