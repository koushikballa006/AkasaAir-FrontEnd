'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: {
    url: string;
  };
  inStock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  itemTotal: number;
}

interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const fetchCart = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('https://akasaair-backend.onrender.com/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data: Cart = await response.json();
      setCart(data);

      setQuantities(prevQuantities => {
        const newQuantities = { ...prevQuantities };
        data.items.forEach((item) => {
          if (!(item.product._id in newQuantities)) {
            newQuantities[item.product._id] = item.quantity;
          }
        });
        return newQuantities;
      });
    } catch (err) {
      setError('Error fetching cart. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    const intervalId = setInterval(fetchCart, 3000);
    return () => clearInterval(intervalId);
  }, [fetchCart]);

  const handleQuantityChange = useCallback((productId: string, value: string) => {
    const numValue = parseInt(value, 10);
    
    setQuantities(prev => {
      const item = cart.items.find(item => item.product._id === productId);
      const maxStock = item ? item.product.inStock : 1;
      const newQuantity = isNaN(numValue) ? 1 : Math.max(1, Math.min(numValue, maxStock));
      
      if (prev[productId] === newQuantity) {
        return prev;
      }
      
      return {
        ...prev,
        [productId]: newQuantity
      };
    });
  }, [cart.items]);

  const updateCartItem = async (productId: string, newQuantity: number) => {
    try {
      const response = await fetch(`https://akasaair-backend.onrender.com/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
      toast({
        title: "Success",
        description: "Cart updated successfully",
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`https://akasaair-backend.onrender.com/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span className="text-xl font-semibold">Loading cart...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-xl">{error}</p>
        <Button className="mt-4" onClick={fetchCart}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">Your Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <p className="text-xl text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cart.items.map((item) => (
            <Card key={item.product._id} className="bg-white dark:bg-gray-800">
              <CardHeader>
                <Image
                  src={item.product.image.url}
                  alt={item.product.name}
                  width={500}
                  height={500}
                  className="w-full h-48 object-contain mb-2 rounded-t-lg"
                />
                <CardTitle className="text-green-600 dark:text-green-400">{item.product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mt-2 font-bold">Price: ${item.product.price.toFixed(2)}</p>
                <p className="mt-1">In Stock: {item.product.inStock}</p>
                <div className="flex items-center mt-2">
                  <Input
                    type="number"
                    min="1"
                    max={item.product.inStock}
                    value={quantities[item.product._id] || item.quantity}
                    onChange={(e) => handleQuantityChange(item.product._id, e.target.value)}
                    className="w-20 mr-2"
                  />
                  <Button 
                    className="w-full"
                    onClick={() => updateCartItem(item.product._id, quantities[item.product._id] || item.quantity)}
                    disabled={item.product.inStock === 0 || (quantities[item.product._id] || item.quantity) > item.product.inStock}
                  >
                    {item.product.inStock === 0 ? "Out of Stock" : 
                     (quantities[item.product._id] || item.quantity) > item.product.inStock ? "Exceeds Stock" : "Update"}
                  </Button>
                </div>
                <Button
                  className="w-full mt-2"
                  onClick={() => removeFromCart(item.product._id)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-4">
        <p className="text-xl font-bold">Total: ${cart.totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
}