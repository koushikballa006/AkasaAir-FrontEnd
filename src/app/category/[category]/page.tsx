'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProductsByCategory, addToCart } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const categoryName = Array.isArray(category) ? category[0] : category || '';
      const data = await getProductsByCategory(categoryName);
      setProducts(data.data || []);
    } catch (err) {
      setError('Error fetching products. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 2000);
    return () => clearInterval(intervalId);
  }, [fetchProducts]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
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
                <img
                  src={product.image.url}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-2 rounded-t-lg"
                />
                <CardTitle className="text-green-600 dark:text-green-400">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
                <p className="mt-2 font-bold">Price: ${product.price.toFixed(2)}</p>
                <p className="mt-1">In Stock: {product.inStock}</p>
                <Button 
                  className="mt-2 w-full"
                  onClick={() => handleAddToCart(product._id)}
                  disabled={product.inStock === 0}
                >
                  {product.inStock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}