import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

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

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [toastMessage, setToastMessage] = useState<ToastProps | null>(null);
  const toast = useToast();

  const showToast = useCallback((props: ToastProps) => {
    setToastMessage(props);
    // Hide the toast after 3 seconds
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load order history",
        variant: "destructive",
      });
    }
  }, [showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-4">
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded ${
          toastMessage.variant === 'destructive' ? 'bg-red-500' : 'bg-green-500'
        } text-white z-50`}>
          <h3 className="font-bold">{toastMessage.title}</h3>
          {toastMessage.description && <p>{toastMessage.description}</p>}
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Order History</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map(order => (
          <Card key={order._id} className="mb-4">
            <CardHeader>
              <CardTitle>Order #{order.orderID}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total: ${order.totalAmount.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <h3 className="font-bold mt-2">Items:</h3>
              <ul>
                {order.items.map(item => (
                  <li key={item.product._id}>
                    {item.product.name} - ${item.price.toFixed(2)} x {item.quantity}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}