import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    await addToCart(product._id, 1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }

    return stars;
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/products/${product._id}`}>
        <div className="relative">
          <img
            src={product.images[0] || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              -{discountPercentage}%
            </span>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex">
              {renderStars(product.rating.average)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.rating.count})
            </span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          <ShoppingCartIcon className="h-4 w-4" />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
