import '../../faust.config';
import React from 'react';
import { useRouter } from 'next/router';
import { FaustProvider } from '@faustwp/core';
import { AtlasEcomProvider } from '../hooks/useAtlasEcom';
import '@styles/main.scss';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <FaustProvider pageProps={pageProps}>
      <AtlasEcomProvider>
        <Component {...pageProps} key={router.asPath} />
      </AtlasEcomProvider>
    </FaustProvider>
  );
}
