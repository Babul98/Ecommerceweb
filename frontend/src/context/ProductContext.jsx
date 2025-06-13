import React, { createContext, useContext, useReducer } from 'react';
import api from '../services/api';

const ProductContext = createContext();

const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload.products,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        total: action.payload.total
      };
    case 'SET_FEATURED_PRODUCTS':
      return { ...state, featuredProducts: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_CURRENT_PRODUCT':
      return { ...state, currentProduct: action.payload };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    featuredProducts: [],
    categories: [],
    currentProduct: null,
    totalPages: 0,
    currentPage: 1,
    total: 0,
    loading: false,
    filters: {
      category: 'all',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  });

  const fetchProducts = async (page = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...state.filters
      });

      const response = await api.get(`/products?${params}`);
      dispatch({ type: 'SET_PRODUCTS', payload: response.data });
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products/featured');
      dispatch({ type: 'SET_FEATURED_PRODUCTS', payload: response.data });
    } catch (error) {
      console.error('Fetch featured products error:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      dispatch({ type: 'SET_CATEGORIES', payload: response.data });
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const fetchProduct = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get(`/products/${id}`);
      dispatch({ type: 'SET_CURRENT_PRODUCT', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Fetch product error:', error);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const clearFilters = () => {
    dispatch({ 
      type: 'SET_FILTERS', 
      payload: {
        category: 'all',
        search: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
    });
  };

  const value = {
    ...state,
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    fetchProduct,
    updateFilters,
    clearFilters
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
