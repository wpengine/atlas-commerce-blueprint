import { getNextStaticProps, is404 } from '@faustjs/next';
import { client } from 'client';
import LoginForm from 'components/LoginForm/LoginForm';
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

export default function Page() {
  const { useQuery } = client;
  const generalSettings = useQuery().generalSettings;
  const storeSettings  = useQuery().storeSettings({ first: 1 })?.nodes?.[0];

  return (
    <>
      <SEO
        title={pageTitle(generalSettings)}
      />

      <Header 
      storeSettings={storeSettings}
      />
      <Notification
        storeSettings={storeSettings}
      />
      
      <Main>
        <div className="container">
          <LoginForm />
        </div>
      </Main>

      <Footer 
      storeSettings={storeSettings}
      />
    </>
  );
}

export async function getStaticProps(context) {
    return getNextStaticProps(context, {
      Page,
      client,
      revalidate: 1,
    });
}
