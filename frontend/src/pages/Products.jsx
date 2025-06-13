import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const {
    products,
    categories,
    loading,
    totalPages,
    currentPage,
    total,
    filters,
    fetchProducts,
    fetchCategories,
    updateFilters
  } = useProducts();

  useEffect(() => {
    fetchCategories();
    
    // Update filters based on URL params
    const urlFilters = {
      category: searchParams.get('category') || 'all',
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc'
    };
    
    updateFilters(urlFilters);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    updateFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') params.set(k, v);
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  const priceRanges = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under $25', min: '', max: '25' },
    { label: '$25 - $50', min: '25', max: '50' },
    { label: '$50 - $100', min: '50', max: '100' },
    { label: '$100 - $200', min: '100', max: '200' },
    { label: 'Over $200', min: '200', max: '' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDownIcon className={`h-5 w-5 ml-auto transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`bg-white rounded-lg p-6 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={filters.category === 'all'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2">All Categories</span>
                </label>
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                      onChange={() => {
                        handleFilterChange('minPrice', range.min);
                        handleFilterChange('maxPrice', range.max);
                      }}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Price Range */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Custom Price Range</h3>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
              <p className="text-gray-600">
                {total} {total === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating.average-desc">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <nav className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
