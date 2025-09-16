import { BASE_URL } from '../endpoints';

const request = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const getWishlist = async (token) => {
  return request(`${BASE_URL}/api/wishlist`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const addToWishlist = async (token, { itemId, itemType }) => {
  return request(`${BASE_URL}/api/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ itemId, itemType }),
  });
};

export const removeFromWishlist = async (token, itemId) => {
  return request(`${BASE_URL}/api/wishlist/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
