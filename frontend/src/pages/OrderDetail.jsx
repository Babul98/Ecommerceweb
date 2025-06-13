import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <button
            onClick={() => navigate('/orders')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Orders
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order._id.slice(-8)}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
            order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image || '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="text-sm text-gray-600">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span> • </span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      <span className="font-medium">${item.price.toFixed(2)} each</span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.email}</p>
              <p>{order.shippingAddress.phone}</p>
              <p className="mt-2">{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className={`capitalize ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Tracking Information</h3>
                <p className="text-blue-700">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
