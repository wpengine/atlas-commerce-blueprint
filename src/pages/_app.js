import 'faust.config';
import { FaustProvider } from '@faustjs/next';
import 'normalize.css/normalize.css';
import 'styles/main.scss';
import React from 'react';
import { client } from 'client';
import ThemeStyles from 'components/ThemeStyles/ThemeStyles';
import { AtlasEcomProvider } from 'hooks/useAtlasEcom';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeStyles />
      <FaustProvider client={client} pageProps={pageProps}>
        <AtlasEcomProvider>
          <Component {...pageProps} />
        </AtlasEcomProvider>
      </FaustProvider>
    </>
  );
}
