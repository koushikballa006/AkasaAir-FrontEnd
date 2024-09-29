"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

interface OutOfStockItem {
  id: string;
  name: string;
  requested: number;
  available: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [outOfStockItems, setOutOfStockItems] = useState<OutOfStockItem[]>([]);
  const [showOutOfStockDialog, setShowOutOfStockDialog] = useState(false);
  const { toast } = useToast();
  const prevOutOfStockItemsRef = useRef<OutOfStockItem[]>([]);

  const fetchCart = useCallback(async () => {
    try {
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
      
      const newOutOfStockItems = data.items
        .filter(item => item.product.inStock < item.quantity)
        .map(item => ({
          id: item.product._id,
          name: item.product.name,
          requested: item.quantity,
          available: item.product.inStock
        }));
      
      setOutOfStockItems(newOutOfStockItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCart();
    const intervalId = setInterval(fetchCart, 5000);
    return () => clearInterval(intervalId);
  }, [fetchCart]);

  useEffect(() => {
    const hasNewOutOfStockItems = outOfStockItems.some(item => 
      !prevOutOfStockItemsRef.current.some(prevItem => 
        prevItem.id === item.id && prevItem.available === item.available
      )
    );

    if (hasNewOutOfStockItems && outOfStockItems.length > 0) {
      setShowOutOfStockDialog(true);
    }

    prevOutOfStockItemsRef.current = outOfStockItems;
  }, [outOfStockItems]);

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

  const updateQuantity = async (productId: string, newQuantity: number) => {
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
        throw new Error('Failed to update item quantity');
      }
      toast({
        title: "Success",
        description: "Item quantity updated",
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update item quantity",
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const item = cart.items.find(item => item.product._id === productId);
    if (item) {
      const newQuantity = Math.max(1, Math.min(item.quantity + change, item.product.inStock));
      if (newQuantity !== item.quantity) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const checkout = async () => {
    try {
      const response = await fetch('https://akasaair-backend.onrender.com/api/cart/checkout', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: `Order placed successfully. Order ID: ${data.orderID}`,
        });
        fetchCart();
      } else if (response.status === 400 && data.outOfStockItems) {
        setOutOfStockItems(data.outOfStockItems);
        setShowOutOfStockDialog(true);
      } else {
        throw new Error(data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Checkout failed",
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
          {cart.items.map((item: CartItem) => (
            <Card key={item.product._id} className="mb-4">
              <CardHeader>
                <CardTitle>{item.product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image 
                    src={item.product.image.url} 
                    alt={item.product.name} 
                    width={64}
                    height={64}
                    className="object-cover mr-4" 
                  />
                  <div>
                    <p>Price: ${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        onClick={() => handleQuantityChange(item.product._id, -1)}
                        disabled={item.quantity <= 1}
                        size="sm"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        onClick={() => handleQuantityChange(item.product._id, 1)}
                        disabled={item.quantity >= item.product.inStock}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p>Total: ${item.itemTotal.toFixed(2)}</p>
                    {item.product.inStock < item.quantity && (
                      <p className="text-red-500">Only {item.product.inStock} in stock</p>
                    )}
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
              disabled={outOfStockItems.length > 0}
            >
              Checkout
            </Button>
          </div>
        </>
      )}
      <Dialog open={showOutOfStockDialog} onOpenChange={setShowOutOfStockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Out of Stock Items</DialogTitle>
            <DialogDescription>
              The following items are out of stock or have insufficient quantity:
            </DialogDescription>
          </DialogHeader>
          <ul>
            {outOfStockItems.map((item: OutOfStockItem) => (
              <li key={item.id} className="mb-2">
                {item.name}: Requested {item.requested}, Available {item.available}
              </li>
            ))}
          </ul>
          <Button onClick={() => { setShowOutOfStockDialog(false); }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}