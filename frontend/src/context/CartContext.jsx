import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'ADD_ITEM':
      return { ...state, cart: action.payload };
    case 'UPDATE_ITEM':
      return { ...state, cart: action.payload };
    case 'REMOVE_ITEM':
      return { ...state, cart: action.payload };
    case 'CLEAR_CART':
      return { ...state, cart: { items: [], totalAmount: 0 } };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: { items: [], totalAmount: 0 },
    loading: false
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/cart');
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    try {
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        size,
        color
      });
      
      dispatch({ type: 'ADD_ITEM', payload: response.data.cart });
      toast.success('Item added to cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/item/${itemId}`, { quantity });
      dispatch({ type: 'UPDATE_ITEM', payload: response.data.cart });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item';
      toast.error(message);
      return { success: false, message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.delete(`/cart/item/${itemId}`);
      dispatch({ type: 'REMOVE_ITEM', payload: response.data.cart });
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return { success: false, message };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const getCartItemsCount = () => {
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
