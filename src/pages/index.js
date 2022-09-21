import { getNextStaticProps } from '@faustjs/next';
import React from 'react';
import { client } from 'client';

import { PageComponent } from './[...pageUri]';

export default function Page() {
  const { usePage } = client;
  const page = usePage({ id: '/', idType: 'URI' });

  return <PageComponent page={page} />;
}

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page,
    client,
    revalidate: 1,
  });
}
