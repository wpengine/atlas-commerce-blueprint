import { getNextStaticProps } from '@faustjs/next';
import { client } from 'client';
import {
  Footer,
  Header,
  Notification,
  Main,
  SEO,
  SearchRecommendations,
} from 'components';
import { pageTitle } from 'utils';

export default function Page() {
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
          <div style={{ marginTop: '80px' }}>
            <SearchRecommendations />
          </div>
        </div>
      </Main>

      <Footer storeSettings={storeSettings} />
    </>
  );
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
    client,
    revalidate: 1,
    // notFound: await is404(context, { client }),
  });
}
