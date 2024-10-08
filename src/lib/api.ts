const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://akasaair-backend.onrender.com/api';

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
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    } else if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add item to cart');
    } else {
      throw new Error('Failed to add item to cart');
    }
  }
  
  return response.json();
}

export async function getCartCount() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/cart/count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log(response)
  if (!response.ok) {
    throw new Error('Failed to fetch cart count');
  }
  return response.json();
}

