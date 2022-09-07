import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import cookieCutter from 'cookie-cutter';

async function fetchCart(body) {
  const userToken = cookieCutter.get('tecom-token-user');
  const cartToken = cookieCutter.get('tecom-token-cart');
  const bearerToken = userToken || cartToken;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (bearerToken) {
    headers['Authorization'] = 'Bearer ' + bearerToken;
  }
  
  const result = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/tecom/v1/cart`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await result.json();
  
  if (data.token) {
    cookieCutter.set('tecom-token-' + (
      userToken
      ? 'user'
      : 'cart'
    ), data.token, { path: '/' });
  }
  
  if (data.cart_data) {
    data.cart_data = JSON.parse(data.cart_data);
  }
  
  return data;
}


export const TEcomContext = React.createContext({});

export function TEcomProvider({ children }) {
  const [cartData, setCartData] = useState();
  const router = useRouter();
  
  useEffect(() => {
    checkCart();
    
    function handleRouteChange(url, { shallow }) {
      checkCart();
    }
    
    function handleVisibilityChange(event) {
      if (document.visibilityState === 'visible') {
        checkCart();
      }
    }
    
    router.events.on('routeChangeStart', handleRouteChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  async function addToCart(lineItems) {
    const data = await fetchCart({ action: 'add', line_items: lineItems });
    
    if (data.cart_data) {
      setCartData(data.cart_data);
    }

    return data;
  }
  
  async function checkCart() {
    const data = await fetchCart({ action: 'check' });
    
    if (data.status !== 200 && data.message.indexOf('deleted')) {
      cookieCutter.set('tecom-token-cart', '', { path: '/', expires: new Date(0) });
    }
    
    setCartData(data.cart_data);
  }
  
  const value = {
    cartData,
    addToCart,
    checkCart,
  };
  
  return <TEcomContext.Provider value={value}>{children}</TEcomContext.Provider>;
}

export default function useTEcom() {
  const tEcom = useContext(TEcomContext);
  return tEcom;
}
