'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: {
      url: string;
    };
  };
  quantity: number;
  itemTotal: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[], totalAmount: number }>({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        throw new Error('Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart/${productId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Item removed from cart",
        });
        fetchCart();
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const checkout = async () => {
    try {
      const response = await fetch('/api/cart/checkout', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `Order placed successfully. Order ID: ${data.orderID}`,
        });
        fetchCart();
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Error",
        description: "Checkout failed",
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">Your Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <p className="text-xl text-center">Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map(item => (
            <Card key={item.product._id} className="mb-4">
              <CardHeader>
                <CardTitle>{item.product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={item.product.image.url} alt={item.product.name} className="w-16 h-16 object-cover mr-4" />
                  <div>
                    <p>Price: ${item.product.price.toFixed(2)}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total: ${item.itemTotal.toFixed(2)}</p>
                  </div>
                </div>
                <Button
                  onClick={() => removeFromCart(item.product._id)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="mt-4">
            <p className="text-xl font-bold">Total: ${cart.totalAmount.toFixed(2)}</p>
            <Button
              onClick={checkout}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white"
            >
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}