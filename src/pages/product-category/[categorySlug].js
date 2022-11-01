import { getNextStaticProps } from '@faustjs/next';
import { client } from 'client';
import {
  Footer,
  Header,
  Notification,
  Main,
  SEO,
  ProductSort,
  BreadCrumbsMenu,
} from 'components';
import styles from 'styles/pages/_Shop.module.scss';
import { pageTitle } from 'utils';
import { classNames } from 'utils';

import { useRouter } from 'next/router';

export function ShopComponent({ productCategory }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          'Product Category',
          generalSettings?.title
        )}
        imageUrl={false /*product?.featuredImage?.node?.sourceUrl?.()*/}
      />

      <Header storeSettings={storeSettings} />
      <Notification storeSettings={storeSettings} />

      <Main>
        <div className='container'>
          <section className={styles.bannerHero}>
            <div className='hero-content-container row'>
              <div className={classNames(['column', styles.heroContent])}>
                <BreadCrumbsMenu
                  path='/product-category/'
                  label='Product Category'
                  title={productCategory?.name}
                />
                <h1 className='section-header'>{productCategory?.name}</h1>
                <div
                  className='category-description'
                  dangerouslySetInnerHTML={{
                    __html: productCategory?.description,
                  }}
                />
              </div>
              {productCategory?.imageUrl ? (
                <div className={classNames(['column', styles.heroImage])}>
                  <img
                    src={productCategory?.imageUrl}
                    alt={productCategory?.name}
                  />
                </div>
              ) : null}
            </div>
          </section>

          <div className={classNames(['row', 'row-wrap', styles.shop])}>
            <ProductSort
              products={productCategory?.products({ first: 1000 })?.nodes}
            />
          </div>
        </div>
      </Main>

      <Footer storeSettings={storeSettings} />
    </>
  );
}

export default function Page() {
  const router = useRouter();
  const { query } = router;
  const { useQuery } = client;
  const productCategory = useQuery().productCategory({
    id: query.categorySlug,
    idType: 'SLUG',
  });

  return <ShopComponent productCategory={productCategory} />;
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
    client,
    revalidate: 1,
    // notFound: await is404(context, { client }),
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
