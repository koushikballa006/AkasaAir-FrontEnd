'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProductsByCategory, addToCart } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  inStock: number;
  image: {
    url: string;
  };
}

export default function CategoryProductsPage() {
  const { category } = useParams<{ category: string | string[] }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const categoryName = Array.isArray(category) ? category[0] : category || '';
      const data = await getProductsByCategory(categoryName);
      setProducts(prevProducts => {
        return data.data.map((newProduct: Product) => ({
          ...newProduct,
          inStock: newProduct.inStock
        }));
      });

      setQuantities(prevQuantities => {
        const newQuantities = { ...prevQuantities };
        data.data.forEach((product: Product) => {
          if (!(product._id in newQuantities)) {
            newQuantities[product._id] = 1;
          }
        });
        return newQuantities;
      });
    } catch (err) {
      setError('Error fetching products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 3000);
    return () => clearInterval(intervalId);
  }, [fetchProducts]);

  const handleQuantityChange = useCallback((productId: string, value: string) => {
    const numValue = parseInt(value, 10);
    
    setQuantities(prev => {
      const product = products.find(p => p._id === productId);
      const maxStock = product ? product.inStock : 1;
      const newQuantity = isNaN(numValue) ? 1 : Math.max(1, Math.min(numValue, maxStock));
      
      if (prev[productId] === newQuantity) {
        return prev;
      }
      
      return {
        ...prev,
        [productId]: newQuantity
      };
    });
  }, [products]);

  const handleAddToCart = async (productId: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        duration: 3000,
      });
      router.push('/login');
      return;
    }

    const quantity = quantities[productId] || 1;
    try {
      await addToCart(productId, quantity);
      toast({
        title: "Success",
        description: `Added ${quantity} item(s) to cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "You have added maximum items from stock",
        variant: "destructive",
      });
    }
  };

  const categoryName = Array.isArray(category) ? category[0] : category;
  const decodedCategory = decodeURIComponent(categoryName || '').replace(/&/g, ' and ');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span className="text-xl font-semibold">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-xl">{error}</p>
        <Button className="mt-4" onClick={fetchProducts}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">{decodedCategory} Products</h1>
      {products.length === 0 ? (
        <p className="text-xl text-center">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product._id} className="bg-white dark:bg-gray-800">
              <CardHeader>
                <Image
                  src={product.image?.url || '/placeholder-image.jpg'}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-48 object-contain mb-2 rounded-t-lg"
                />
                <CardTitle className="text-green-600 dark:text-green-400">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                <p className="mt-2 font-bold">Price: ₹{product.price.toFixed(2)}</p>
                <p className="mt-1">In Stock: {product.inStock}</p>
                <div className="flex items-center mt-2">
                  <Input
                    type="number"
                    min="1"
                    max={product.inStock}
                    value={quantities[product._id] || 1}
                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                    className="w-20 mr-2"
                  />
                  <Button 
                    className="w-full"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.inStock === 0 || quantities[product._id] > product.inStock}
                  >
                    {product.inStock === 0 ? "Out of Stock" : 
                     quantities[product._id] > product.inStock ? "Exceeds Stock" : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}