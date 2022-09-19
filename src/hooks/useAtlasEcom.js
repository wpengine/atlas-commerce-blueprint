import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import cookieCutter from 'cookie-cutter';

async function fetchCart(body) {
  const userToken = cookieCutter.get('atlasecom-token-user');
  const cartToken = cookieCutter.get('atlasecom-token-cart');
  const bearerToken = userToken || cartToken;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (bearerToken) {
    headers['Authorization'] = 'Bearer ' + bearerToken;
  }

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/atlas-commerce-connector-bigcommerce/v1/cart`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }
  );

  const data = await result.json();

  if (data.token) {
    cookieCutter.set(
      'atlasecom-token-' + (userToken ? 'user' : 'cart'),
      data.token,
      { path: '/' }
    );
  }

  if (data.cart_data) {
    data.cart_data = JSON.parse(data.cart_data);
  }

  return data;
}

export const AtlasEcomContext = React.createContext({});

export function AtlasEcomProvider({ children }) {
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
      cookieCutter.set('atlasecom-token-cart', '', {
        path: '/',
        expires: new Date(0),
      });
    }

    setCartData(data.cart_data);
  }

  const value = {
    cartData,
    addToCart,
    checkCart,
  };

  return (
    <AtlasEcomContext.Provider value={value}>
      {children}
    </AtlasEcomContext.Provider>
  );
}

export default function useAtlasEcom() {
  const AtlasEcom = useContext(AtlasEcomContext);
  return AtlasEcom;
}