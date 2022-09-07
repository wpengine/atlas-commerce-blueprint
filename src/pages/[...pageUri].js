import { getNextStaticProps, is404 } from '@faustjs/next';
import { client } from 'client';
import {
  Header,
  Notification,
  EntryHeader,
  ContentWrapper,
  Footer,
  Main,
  SEO,
} from 'components';
import { pageTitle } from 'utils';

export function PageComponent({ page }) {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          page?.title(),
          generalSettings?.title
        )}
        imageUrl={page?.featuredImage?.node?.sourceUrl?.()}
      />
      <Header
        storeSettings={storeSettings}
      />
      <Notification
        storeSettings={storeSettings}
      />
      <Main>
        
        <div className="_container">
          <ContentWrapper content={page?.content()} />
        </div>
      </Main>

      <Footer 
        storeSettings={storeSettings}
      />
    </>
  );
}

export default function Page() {
  const { usePage } = client;
  const page = usePage();

  return <PageComponent page={page} />;
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
    client,
    notFound: await is404(context, { client }),
    revalidate: 1,
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
