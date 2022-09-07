import { getNextStaticProps, is404 } from '@faustjs/next';
import { client } from 'client';
import {
  ContentWrapper,
  Footer,
  Header,
  Notification,
  EntryHeader,
  Main,
  SEO,
  TaxonomyTerms,
  ProductSummary,
  ProductSort,
} from 'components';
import styles from 'styles/pages/_Shop.module.scss';
import { pageTitle } from 'utils';
import { classNames } from 'utils';


import Link from 'next/link';

export function ShopComponent({ products }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          'Shop',
          generalSettings?.title
        )}
        imageUrl={false/*product?.featuredImage?.node?.sourceUrl?.()*/}
      />

      <Header
      storeSettings={storeSettings}
      />
      <Notification
        storeSettings={storeSettings}
      />

      <Main>
        <div className="container">
          <div className={styles.shopTitle}>
            <h1>Shop</h1>
          </div>

          <div className={classNames(['row', 'row-wrap', styles.shop])}>
            <ProductSort products={products} />
          </div>
        </div>
      </Main>

      <Footer
      storeSettings={storeSettings}
      />
    </>
  );
}

export default function Page() {
  const { useQuery } = client;
  const products = useQuery().products({ first: 100 });

  return <ShopComponent products={products?.nodes} />;
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
    client,
    revalidate: 1,
    // notFound: await is404(context, { client }),
  });
}
