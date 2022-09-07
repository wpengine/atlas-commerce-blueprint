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

import { useRouter } from 'next/router';
import Link from 'next/link';

export function ShopComponent({ productCategory }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          'Product Category',
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
          <section className={styles.bannerHero}>
            <div className="hero-content-container row">
              <div className={classNames(['column', styles.heroContent])}>
                <nav className={styles.breadcrumbsContainer}>
                  <ul className={styles.breadcrumbs}>
                    <li className={styles.breadcrumb}>
                      <a href="/"><span>Home</span></a>
                    </li>
                    <li className={styles.breadcrumb}>
                      <a href="/product-category/"><span>Product Category</span></a>
                    </li>
                    <li className={classNames([styles.breadcrumb, styles.isActive])}>
                      <span>{productCategory?.name}</span>
                    </li>
                  </ul>
                </nav>
                <h1 className="section-header">{productCategory?.name}</h1>
                <div
                  className="category-description"
                  dangerouslySetInnerHTML={{ __html: productCategory?.description }}
                />
              </div>
              {
                productCategory?.imageUrl
                ? (
                  <div className={classNames(['column', styles.heroImage])}>
                    <img src={productCategory?.imageUrl} alt={productCategory?.name} />
                  </div>
                )
                : null
              }
            </div>
          </section>

          <div className={classNames(['row', 'row-wrap', styles.shop])}>
            <ProductSort products={productCategory?.products({ first: 1000 })?.nodes} />
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
  const router = useRouter();
  const { query } = router;
  const { useQuery } = client;
  const products = useQuery().products({ first: 100 });
  const productCategory = useQuery().productCategory({ id: query.categorySlug, idType: 'SLUG' });

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
