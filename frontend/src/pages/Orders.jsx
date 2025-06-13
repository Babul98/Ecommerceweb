import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ClockIcon, TruckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet</p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.orderStatus)}
                    <span className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item._id} className="flex items-center space-x-3">
                        <img
                          src={item.image || '/placeholder-image.jpg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} • ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-600">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-3">Delivery Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Payment: <span className="capitalize">{order.paymentMethod}</span>
                  {order.paymentStatus === 'paid' && (
                    <span className="ml-2 text-green-600">✓ Paid</span>
                  )}
                </div>
                
                <Link
                  to={`/orders/${order._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
