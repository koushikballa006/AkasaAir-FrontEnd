"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderID: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load order history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-500';
      case 'processing': return 'text-blue-500';
      case 'shipped': return 'text-purple-500';
      case 'delivered': return 'text-green-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">Order History</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">You haven't placed any orders yet.</p>
            <div className="mt-4 flex justify-center">
              <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                <a href="/menu">Browse Menu</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="mb-6 overflow-hidden">
            <CardHeader className="bg-green-50 dark:bg-green-900">
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order.orderID}</span>
                <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="font-semibold mt-2">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.product._id} className="flex justify-between items-center text-sm">
                      <span>{item.product.name}</span>
                      <span>${item.price.toFixed(2)} x {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderHistory;