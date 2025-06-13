import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';

const Home = () => {
  const { featuredProducts, fetchFeaturedProducts, loading } = useProducts();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const features = [
    {
      icon: <ShoppingBagIcon className="h-8 w-8" />,
      title: 'Quality Products',
      description: 'Curated selection of high-quality products from trusted brands'
    },
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Secure Payment',
      description: 'Safe and secure payment processing with encryption'
    },
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to eCommerce
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover amazing products at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/products?category=electronics"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                View Electronics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600">
              Explore our wide range of product categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'Electronics', image: '/categories/electronics.jpg' },
              { name: 'Clothing', image: '/categories/clothing.jpg' },
              { name: 'Books', image: '/categories/books.jpg' },
              { name: 'Home', image: '/categories/home.jpg' },
              { name: 'Sports', image: '/categories/sports.jpg' },
              { name: 'Beauty', image: '/categories/beauty.jpg' },
              { name: 'Toys', image: '/categories/toys.jpg' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, special offers, and exclusive deals
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
             
              <button className="bg-primary-800 text-white px-6 py-3 rounded-r-lg hover:bg-primary-900 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

