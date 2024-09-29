// import React, { useState, useEffect, useCallback } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";

// interface CartItem {
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//   };
//   quantity: number;
//   itemTotal: number;
// }

// interface ToastProps {
//   title: string;
//   description?: string;
//   variant?: 'default' | 'destructive';
// }

// export default function ShoppingCart() {
//   const [cart, setCart] = useState<{ items: CartItem[], totalAmount: number }>({ items: [], totalAmount: 0 });
//   const [toastMessage, setToastMessage] = useState<ToastProps | null>(null);
//   const toast = useToast();

//   const showToast = useCallback((props: ToastProps) => {
//     setToastMessage(props);
//     // Hide the toast after 3 seconds
//     setTimeout(() => setToastMessage(null), 3000);
//   }, []);

//   const fetchCart = useCallback(async () => {
//     try {
//       const response = await fetch('/api/cart', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setCart(data);
//       } else {
//         throw new Error('Failed to fetch cart');
//       }
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       showToast({
//         title: "Error",
//         description: "Failed to load cart",
//         variant: "destructive",
//       });
//     }
//   }, [showToast]);

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   const removeFromCart = async (productId: string) => {
//     try {
//       const response = await fetch(`/api/cart/${productId}`, { 
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (response.ok) {
//         showToast({
//           title: "Success",
//           description: "Item removed from cart",
//         });
//         fetchCart();
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to remove item from cart');
//       }
//     } catch (error) {
//       console.error('Error removing item from cart:', error);
//       showToast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to remove item from cart",
//         variant: "destructive",
//       });
//     }
//   };

//   const checkout = async () => {
//     try {
//       const response = await fetch('/api/cart/checkout', { 
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (response.ok) {
//         const data = await response.json();
//         showToast({
//           title: "Success",
//           description: `Order placed successfully. Order ID: ${data.orderID}`,
//         });
//         fetchCart();
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Checkout failed');
//       }
//     } catch (error) {
//       console.error('Error during checkout:', error);
//       showToast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Checkout failed",
//         variant: "destructive",
//       });
//     }
//   };

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
//       <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Your Shopping Cart</h2>
//       {cart.items.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           {cart.items.map(item => (
//             <Card key={item.product._id} className="mb-4">
//               <CardHeader>
//                 <CardTitle>{item.product.name}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p>Price: ${item.product.price.toFixed(2)}</p>
//                 <p>Quantity: {item.quantity}</p>
//                 <p>Total: ${item.itemTotal.toFixed(2)}</p>
//                 <Button
//                   onClick={() => removeFromCart(item.product._id)}
//                   variant="destructive"
//                   className="mt-2"
//                 >
//                   Remove
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//           <div className="mt-4">
//             <p className="text-xl font-bold">Total: ${cart.totalAmount.toFixed(2)}</p>
//             <Button
//               onClick={checkout}
//               className="mt-4 bg-green-500 hover:bg-green-600 text-white"
//             >
//               Checkout
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }