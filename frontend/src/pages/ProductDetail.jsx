import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  StarIcon, 
  ShoppingCartIcon, 
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loading, fetchProduct } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  useEffect(() => {
    if (currentProduct) {
      setSelectedImage(0);
      setSelectedSize(currentProduct.sizes?.[0] || '');
      setSelectedColor(currentProduct.colors?.[0] || '');
    }
  }, [currentProduct]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (currentProduct.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (quantity > currentProduct.stock) {
      toast.error('Not enough stock available');
      return;
    }

    await addToCart(currentProduct._id, quantity, selectedSize, selectedColor);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-400" />);
      } else {
        stars.push(<StarOutlineIcon key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = currentProduct.originalPrice 
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={currentProduct.images[selectedImage] || '/placeholder-image.jpg'}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
            />
            {discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-medium">
                -{discountPercentage}%
              </span>
            )}
          </div>
          
          {currentProduct.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {currentProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${currentProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentProduct.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {renderStars(currentProduct.rating.average)}
                <span className="ml-2 text-sm text-gray-600">
                  ({currentProduct.rating.count} reviews)
                </span>
              </div>
              
              {currentProduct.brand && (
                <span className="text-sm text-gray-600">
                  Brand: <span className="font-medium">{currentProduct.brand}</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${currentProduct.price.toFixed(2)}
              </span>
              {currentProduct.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${currentProduct.originalPrice.toFixed(2)}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-green-600 font-medium">
                  Save {discountPercentage}%
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          {/* Features */}
          {currentProduct.features && currentProduct.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {currentProduct.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Size Selection */}
          {currentProduct.sizes && currentProduct.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {currentProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {currentProduct.colors && currentProduct.colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {currentProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md capitalize ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-xl font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-sm text-gray-600 ml-4">
                  {currentProduct.stock} in stock
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={currentProduct.stock === 0}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors ${
                  currentProduct.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>
                  {currentProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </span>
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <HeartIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <TruckIcon className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Free Delivery</p>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Secure Payment</p>
                <p className="text-sm text-gray-600">100% secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
