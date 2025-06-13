import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9M7 13l1.8-9M17 13l1.8 9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalAmount;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Cart Items ({cart.items.length})
              </h2>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.product.images[0] || '/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {item.product.name}
                      </Link>
                      
                      <div className="text-sm text-gray-600 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      
                      <div className="text-lg font-semibold text-gray-900 mt-2">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {shipping > 0 && (
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $100
                </p>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium mb-4"
            >
              Proceed to Checkout
            </button>
            
            <Link
              to="/products"
              className="block text-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
