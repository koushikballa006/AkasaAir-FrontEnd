// import React, { useState, useEffect, useCallback } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import Image from 'next/image';

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   inStock: number;
//   category: string;
//   image: {
//     public_id: string;
//     url: string;
//   };
// }

// interface ToastProps {
//   title: string;
//   description?: string;
//   variant?: 'default' | 'destructive';
// }

// export default function ItemInventory() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [toastMessage, setToastMessage] = useState<ToastProps | null>(null);
//   const toast = useToast();

//   const showToast = useCallback((props: ToastProps) => {
//     setToastMessage(props);
//     setTimeout(() => setToastMessage(null), 3000);
//   }, []);

//   const fetchProducts = useCallback(async () => {
//     try {
//       const response = await fetch('/api/products');
//       if (response.ok) {
//         const data = await response.json();
//         setProducts(data.data);
//       } else {
//         throw new Error('Failed to fetch products');
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       showToast({
//         title: "Error",
//         description: "Failed to load products",
//         variant: "destructive",
//       });
//     }
//   }, [showToast]);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const addToCart = async (productId: string, quantity: number) => {
//     try {
//       const response = await fetch('/api/cart/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ productId, quantity }),
//       });
//       if (response.ok) {
//         showToast({
//           title: "Success",
//           description: "Item added to cart",
//         });
//       } else {
//         throw new Error('Failed to add item to cart');
//       }
//     } catch (error) {
//       showToast({
//         title: "Error",
//         description: "Failed to add item to cart",
//         variant: "destructive",
//       });
//     }
//   };

//   const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
//   const filteredProducts = products.filter(product =>
//     (selectedCategory === 'All' || product.category === selectedCategory) &&
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4">
//       {toastMessage && (
//         <div className={`fixed top-4 right-4 p-4 rounded ${
//           toastMessage.variant === 'destructive' ? 'bg-red-500' : 'bg-green-500'
//         } text-white z-50`}>
//           <h3 className="font-bold">{toastMessage.title}</h3>
//           {toastMessage.description && <p>{toastMessage.description}</p>}
//         </div>
//       )}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
//         <div className="flex flex-wrap gap-2">
//           {categories.map(category => (
//             <Button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               variant={selectedCategory === category ? "default" : "outline"}
//               className="bg-green-500 hover:bg-green-600 text-white"
//             >
//               {category}
//             </Button>
//           ))}
//         </div>
//         <Input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-xs"
//         />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filteredProducts.map(product => (
//           <Card key={product._id} className="flex flex-col">
//             <div className="relative h-48 w-full">
//               <Image
//                 src={product.image?.url || '/placeholder-image.jpg'}
//                 alt={product.name}
//                 layout="fill"
//                 objectFit="cover"
//                 className="rounded-t-lg"
//               />
//             </div>
//             <CardHeader>
//               <CardTitle>{product.name}</CardTitle>
//             </CardHeader>
//             <CardContent className="flex-grow">
//               <p>{product.description}</p>
//               <p className="font-bold mt-2">Price: ${product.price.toFixed(2)}</p>
//               <p>In Stock: {product.inStock}</p>
//               <Button
//                 onClick={() => addToCart(product._id, 1)}
//                 className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white"
//               >
//                 Add to Cart
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }