const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getAllProducts() {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function getProductsByCategory(category: string) {
  const response = await fetch(`${API_URL}/products/category/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function addToCart(productId: string, quantity: number) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 400 && data.message.includes('exceeds available stock')) {
      throw new Error(`Only ${data.availableStock} items available in stock.`);
    }
    throw new Error(data.message || 'Failed to add item to cart');
  }
  
  return data;
}

export async function getCartCount() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/cart/count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart count');
  }
  return response.json();
}