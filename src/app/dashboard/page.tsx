'use client'

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemInventory from '@/components/dashboard/ItemInventory';
import ShoppingCart from '@/components/dashboard/ShoppingCart';
import OrderHistory from '@/components/dashboard/OrderHistory';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Browse Inventory</TabsTrigger>
          <TabsTrigger value="cart">Shopping Cart</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <ItemInventory />
        </TabsContent>
        <TabsContent value="cart">
          <ShoppingCart />
        </TabsContent>
        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}