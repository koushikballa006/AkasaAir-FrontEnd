"use client";
import React, { useState, useEffect, useCallback } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [outOfStockItems, setOutOfStockItems] = useState<OutOfStockItem[]>([]);
  const [showOutOfStockDialog, setShowOutOfStockDialog] = useState(false);
  const [isCartValid, setIsCartValid] = useState(false);
  const { toast } = useToast();

  const validateCart = useCallback((cartItems: CartItem[]) => {
    const invalidItems = cartItems.filter(item => item.quantity > item.product.inStock);
    
    // Set out of stock items
    setOutOfStockItems(invalidItems.map(item => ({
      id: item.product._id,
      name: item.product.name,
      requested: item.quantity,
      available: item.product.inStock
    })));

    // Cart is valid if all items are in stock and there is at least one item
    const hasValidItems = cartItems.length > 0 && invalidItems.length === 0;
    setIsCartValid(hasValidItems);
  }, []);

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

      validateCart(data.items);
    } catch (err) {
      setError('Error fetching cart. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [validateCart]);

  useEffect(() => {
    fetchCart();
    const intervalId = setInterval(fetchCart, 3000); // Re-fetch cart every 3 seconds
    return () => clearInterval(intervalId);
  }, [fetchCart]);

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
      validateCart(updatedCart.items);
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

  const handleQuantityChange = (productId: string, change: number) => {
    const item = cart.items.find(item => item.product._id === productId);
    if (item) {
      const newQuantity = Math.max(1, Math.min((quantities[productId] || item.quantity) + change, item.product.inStock));
      if (newQuantity !== (quantities[productId] || item.quantity)) {
        setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
        updateCartItem(productId, newQuantity);
      }
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
                        disabled={quantities[item.product._id] <= 1}
                        size="sm"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2">{quantities[item.product._id] || item.quantity}</span>
                      <Button
                        onClick={() => handleQuantityChange(item.product._id, 1)}
                        disabled={quantities[item.product._id] >= item.product.inStock}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Subtotal: ${item.itemTotal.toFixed(2)}
                    </p>
                    <p className="text-red-500 text-sm">
                      In stock: {item.product.inStock}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="destructive"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end">
            <h2 className="text-2xl font-bold">Total: ${cart.totalAmount.toFixed(2)}</h2>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={checkout}
              disabled={!isCartValid}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}

      <Dialog open={showOutOfStockDialog} onOpenChange={setShowOutOfStockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Out of Stock</DialogTitle>
            <DialogDescription>
              Some items in your cart are out of stock. Please update your cart before proceeding to checkout.
            </DialogDescription>
          </DialogHeader>
          <ul>
            {outOfStockItems.map(item => (
              <li key={item.id}>
                {item.name}: Requested {item.requested}, Available {item.available}
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowOutOfStockDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
